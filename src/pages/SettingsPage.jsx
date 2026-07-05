import { useRef, useState } from 'react'
import { usePlants } from '../hooks/usePlants.jsx'
import { exportJSON, importJSON } from '../lib/backup.js'
import { migrate, SCHEMA_VERSION } from '../lib/storage.js'
import ConfirmDialog from '../components/common/ConfirmDialog.jsx'

export default function SettingsPage() {
  const { rawState, replaceState, plants } = usePlants()
  const fileRef = useRef(null)
  const [pending, setPending] = useState(null) // 가져오기 대기 상태
  const [message, setMessage] = useState('')

  const handleExport = () => {
    exportJSON(rawState)
    setMessage('백업 파일을 내려받았어요.')
  }

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // 같은 파일 재선택 허용
    if (!file) return
    try {
      const parsed = await importJSON(file)
      setPending(parsed)
      setMessage('')
    } catch (err) {
      setMessage('⚠️ ' + err.message)
    }
  }

  const confirmImport = () => {
    replaceState(migrate(pending))
    setPending(null)
    setMessage('데이터를 가져왔어요.')
  }

  const totalEvents = plants.reduce((n, p) => {
    const logCount = Object.values(p.logs ?? {}).reduce(
      (sum, arr) => sum + arr.length,
      0,
    )
    return n + logCount + (p.checkLog?.length ?? 0)
  }, 0)

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold text-leaf-900">설정 · 백업</h1>

      <section className="card p-4">
        <h2 className="text-sm font-bold text-leaf-900">현재 데이터</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 text-center">
          <div className="rounded-xl bg-sand-50 py-3">
            <div className="text-2xl font-extrabold text-leaf-700">{plants.length}</div>
            <div className="text-xs text-sand-500">식물</div>
          </div>
          <div className="rounded-xl bg-sand-50 py-3">
            <div className="text-2xl font-extrabold text-leaf-700">{totalEvents}</div>
            <div className="text-xs text-sand-500">전체 기록</div>
          </div>
        </div>
        <p className="mt-3 text-xs text-sand-400">
          모든 데이터는 이 브라우저에만 저장됩니다 (스키마 v{SCHEMA_VERSION}). 기기
          변경·초기화 전에 백업을 권장해요.
        </p>
      </section>

      <section className="card space-y-3 p-4">
        <h2 className="text-sm font-bold text-leaf-900">백업</h2>
        <button className="btn-primary w-full" onClick={handleExport}>
          ⬇️ JSON으로 내보내기
        </button>
        <button className="btn-secondary w-full" onClick={() => fileRef.current?.click()}>
          ⬆️ JSON 가져오기
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          onChange={handleFile}
          className="hidden"
        />
        <p className="text-xs text-sand-400">
          가져오기를 하면 현재 데이터가 파일 내용으로 완전히 교체됩니다.
        </p>
      </section>

      {message && (
        <p className="rounded-xl bg-leaf-50 px-4 py-2 text-sm text-leaf-700">{message}</p>
      )}

      <ConfirmDialog
        open={!!pending}
        title="데이터 가져오기"
        message={`현재 식물 ${plants.length}개가 파일의 ${pending?.plants?.length ?? 0}개로 교체됩니다. 계속할까요?`}
        confirmLabel="가져오기"
        danger
        onConfirm={confirmImport}
        onCancel={() => setPending(null)}
      />
    </div>
  )
}
