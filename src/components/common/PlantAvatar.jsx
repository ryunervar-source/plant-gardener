// 사진이 없는 식물을 위한 이모지/색상 아바타. 이름 해시로 일관된 색을 고른다.
const PALETTE = [
  'bg-leaf-100 text-leaf-700',
  'bg-emerald-100 text-emerald-700',
  'bg-teal-100 text-teal-700',
  'bg-lime-100 text-lime-700',
  'bg-green-100 text-green-700',
]

function hash(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}

export default function PlantAvatar({ plant, size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-10 w-10 text-xl',
    md: 'h-16 w-16 text-3xl',
    lg: 'h-24 w-24 text-5xl',
  }
  if (plant.photo) {
    return (
      <img
        src={plant.photo}
        alt={plant.name}
        className={`${sizes[size]} rounded-2xl object-cover ${className}`}
      />
    )
  }
  const color = PALETTE[hash(plant.name || '') % PALETTE.length]
  return (
    <div
      className={`${sizes[size]} ${color} flex items-center justify-center rounded-2xl ${className}`}
      aria-hidden
    >
      🪴
    </div>
  )
}
