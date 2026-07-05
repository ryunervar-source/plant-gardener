import { Link } from 'react-router-dom'

export default function EmptyState() {
  return (
    <div className="mt-10 flex flex-col items-center text-center">
      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-leaf-50 text-6xl">
        🌱
      </div>
      <h2 className="mt-6 text-xl font-bold text-leaf-900">
        아직 등록된 식물이 없어요
      </h2>
      <p className="mt-2 max-w-xs text-sm text-sand-500">
        키우는 화분을 등록하면 물 주기와 점검 일정을 한눈에 관리할 수 있어요.
      </p>
      <Link to="/plant/new" className="btn-primary mt-6">
        + 첫 식물 등록하기
      </Link>
    </div>
  )
}
