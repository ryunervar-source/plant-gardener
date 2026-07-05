// JSON 백업 내보내기/가져오기 및 이미지 리사이즈 유틸.
import { SCHEMA_VERSION } from './storage.js'

/** 현재 상태를 JSON 파일로 다운로드 */
export function exportJSON(state) {
  const payload = { ...state, version: SCHEMA_VERSION, exportedAt: new Date().toISOString() }
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const stamp = new Date().toISOString().slice(0, 10)
  a.href = url
  a.download = `plant-gardener-backup-${stamp}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/** 파일을 읽어 상태 객체로 파싱. 유효성 검사 후 반환. */
export function importJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result)
        if (!parsed || !Array.isArray(parsed.plants)) {
          reject(new Error('올바른 백업 파일이 아닙니다 (plants 배열이 없습니다).'))
          return
        }
        resolve(parsed)
      } catch (err) {
        reject(new Error('JSON 파싱에 실패했습니다: ' + err.message))
      }
    }
    reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'))
    reader.readAsText(file)
  })
}

/**
 * 이미지 파일을 최대 변 maxSize(px) 이내로 리사이즈해 base64 dataURL 반환.
 * localStorage 용량을 아끼기 위해 JPEG 품질 0.8로 압축.
 */
export function fileToResizedDataURL(file, maxSize = 800) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width)
          width = maxSize
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height)
          height = maxSize
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.onerror = () => reject(new Error('이미지를 불러올 수 없습니다.'))
      img.src = reader.result
    }
    reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'))
    reader.readAsDataURL(file)
  })
}
