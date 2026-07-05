// 간단한 확인 다이얼로그 (삭제 등 되돌리기 어려운 동작에 사용)
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = '확인',
  cancelLabel = '취소',
  danger = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4"
      onClick={onCancel}
    >
      <div
        className="card w-full max-w-sm p-5 safe-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-leaf-900">{title}</h3>
        {message && <p className="mt-2 text-sm text-sand-500">{message}</p>}
        <div className="mt-5 flex gap-3">
          <button className="btn-secondary flex-1" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            className={`${danger ? 'btn-danger' : 'btn-primary'} flex-1`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
