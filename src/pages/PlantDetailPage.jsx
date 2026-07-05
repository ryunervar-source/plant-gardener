import { useState } from 'react'
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom'
import { usePlants } from '../hooks/usePlants.jsx'
import PlantAvatar from '../components/common/PlantAvatar.jsx'
import PlantInfo from '../components/detail/PlantInfo.jsx'
import ActionButtons from '../components/detail/ActionButtons.jsx'
import CareTimeline from '../components/detail/CareTimeline.jsx'
import ChecklistCard from '../components/detail/ChecklistCard.jsx'
import ConfirmDialog from '../components/common/ConfirmDialog.jsx'

export default function PlantDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getPlant, deletePlant } = usePlants()
  const [confirm, setConfirm] = useState(false)

  const plant = getPlant(id)
  if (!plant) return <Navigate to="/" replace />

  const handleDelete = () => {
    deletePlant(id)
    navigate('/', { replace: true })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <PlantAvatar plant={plant} size="lg" className="shrink-0" />
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-extrabold text-leaf-900">{plant.name}</h1>
          <p className="text-sm text-sand-400">{plant.latin}</p>
          <Link
            to={`/plant/${id}/edit`}
            className="mt-2 inline-block text-sm font-semibold text-leaf-600"
          >
            ✏️ 정보 편집
          </Link>
        </div>
      </div>

      <ActionButtons plant={plant} />
      <PlantInfo plant={plant} />
      <ChecklistCard plant={plant} />
      <CareTimeline plant={plant} />

      <button
        onClick={() => setConfirm(true)}
        className="btn-danger w-full"
      >
        🗑 이 식물 삭제
      </button>

      <ConfirmDialog
        open={confirm}
        title={`'${plant.name}' 삭제`}
        message="모든 급수·비료·점검 기록이 함께 삭제됩니다. 되돌릴 수 없어요."
        confirmLabel="삭제"
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirm(false)}
      />
    </div>
  )
}
