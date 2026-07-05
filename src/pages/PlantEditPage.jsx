import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { usePlants } from '../hooks/usePlants.jsx'
import PlantForm from '../components/form/PlantForm.jsx'

export default function PlantEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getPlant, addPlant, editPlant } = usePlants()

  const isNew = !id
  const plant = isNew ? null : getPlant(id)

  if (!isNew && !plant) return <Navigate to="/" replace />

  const handleSubmit = (data) => {
    if (isNew) {
      const newId = addPlant(data)
      navigate(`/plant/${newId}`, { replace: true })
    } else {
      editPlant(id, data)
      navigate(`/plant/${id}`, { replace: true })
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold text-leaf-900">
        {isNew ? '새 식물 등록' : `${plant.name} 편집`}
      </h1>
      <PlantForm
        initial={plant ?? undefined}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
        submitLabel={isNew ? '등록' : '저장'}
      />
    </div>
  )
}
