import { useState } from 'react'
import { fileToResizedDataURL } from '../../lib/backup.js'
import PlantAvatar from '../common/PlantAvatar.jsx'

const EMPTY = {
  name: '',
  latin: '',
  pot: '',
  water_summer_days: 4,
  water_winter_days: 8,
  water_amount: '',
  light: '',
  fertilizer: '',
  cautions: '',
  photo: null,
  special_checks: [],
}

export default function PlantForm({ initial, onSubmit, onCancel, submitLabel = '저장' }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial })
  const [specialText, setSpecialText] = useState(
    (initial?.special_checks ?? []).join('\n'),
  )
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const setNum = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: Math.max(1, Number(e.target.value) || 1) }))

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await fileToResizedDataURL(file)
      setForm((f) => ({ ...f, photo: dataUrl }))
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('이름은 필수입니다.')
      return
    }
    const special_checks = specialText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
    onSubmit({ ...form, name: form.name.trim(), special_checks })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 사진 */}
      <div className="card flex items-center gap-4 p-4">
        <PlantAvatar plant={form} size="lg" className="shrink-0" />
        <div className="flex-1">
          <label className="btn-secondary cursor-pointer text-sm">
            사진 선택
            <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
          </label>
          {form.photo && (
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, photo: null }))}
              className="ml-2 text-sm text-red-500"
            >
              제거
            </button>
          )}
          <p className="mt-1 text-xs text-sand-400">
            자동으로 800px 이내로 압축돼요.
          </p>
        </div>
      </div>

      <div className="card space-y-4 p-4">
        <Field label="이름 *">
          <input className="field-input" value={form.name} onChange={set('name')} placeholder="예: 몬스테라" />
        </Field>
        <Field label="학명">
          <input className="field-input" value={form.latin} onChange={set('latin')} placeholder="Monstera deliciosa" />
        </Field>
        <Field label="화분 크기">
          <input className="field-input" value={form.pot} onChange={set('pot')} placeholder="외경 19cm" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="여름 물주기(일)">
            <input type="number" min="1" className="field-input" value={form.water_summer_days} onChange={setNum('water_summer_days')} />
          </Field>
          <Field label="겨울 물주기(일)">
            <input type="number" min="1" className="field-input" value={form.water_winter_days} onChange={setNum('water_winter_days')} />
          </Field>
        </div>

        <Field label="1회 물 양">
          <input className="field-input" value={form.water_amount} onChange={set('water_amount')} placeholder="700~900mL" />
        </Field>
        <Field label="빛 요구량">
          <input className="field-input" value={form.light} onChange={set('light')} placeholder="밝은 간접광" />
        </Field>
        <Field label="비료">
          <textarea rows={2} className="field-input resize-none" value={form.fertilizer} onChange={set('fertilizer')} placeholder="관엽용 균형 액비, 봄~여름 2주 1회" />
        </Field>
        <Field label="주의사항">
          <textarea rows={3} className="field-input resize-none" value={form.cautions} onChange={set('cautions')} placeholder="과습 주의 등" />
        </Field>
        <Field label="특이 점검 항목 (한 줄에 하나)">
          <textarea rows={3} className="field-input resize-none" value={specialText} onChange={(e) => setSpecialText(e.target.value)} placeholder={'새잎 갈라짐 진행\n공중뿌리 상태'} />
        </Field>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
      )}

      <div className="flex gap-3">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">
          취소
        </button>
        <button type="submit" className="btn-primary flex-1">
          {submitLabel}
        </button>
      </div>
    </form>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
    </div>
  )
}
