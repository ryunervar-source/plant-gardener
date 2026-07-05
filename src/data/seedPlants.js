// 초기 등록 식물 5종. usePlants 훅에서 최초 실행 시 id/로그 필드를 붙여 저장한다.
export const SEED_PLANTS = [
  {
    name: '치자나무',
    latin: 'Gardenia jasminoides',
    pot: '외경 24cm',
    water_summer_days: 3,
    water_winter_days: 6,
    water_amount: '1.2~1.4L',
    light: '밝은 간접광 + 높은 습도',
    fertilizer:
      '산성 전용 비료(진달래·블루베리용), 봄~여름 2주 1회. 잎 노래지면 철분 보충',
    cautions:
      '산성토 필수. 수돗물 석회질에 약함(받아둔 물/빗물 권장). 꽃봉오리 시기 위치 이동 금지. 건조 시 응애',
    special_checks: ['꽃봉오리 상태', '잎 황화(철분 결핍) 여부'],
    activities: ['water', 'fertilizer', 'repot', 'rotate', 'bloom', 'pest'],
    intervals: { fertilizer: 14, repot: 365, mist: 2 },
  },
  {
    name: '오렌지 자스민',
    latin: 'Murraya paniculata',
    pot: '외경 24cm',
    water_summer_days: 4,
    water_winter_days: 8,
    water_amount: '1.2~1.4L',
    light: '하루 4시간 이상 직사광 또는 밝은 창가',
    fertilizer: '꽃식물용 균형 액비, 봄~여름 2주 1회',
    cautions:
      '물 부족 시 잎 처짐, 과습 시 황화 낙엽. 통풍으로 깍지벌레·응애 예방',
    special_checks: ['꽃/향 상태', '깍지벌레 흔적'],
    activities: ['water', 'fertilizer', 'repot', 'rotate', 'bloom', 'pest'],
    intervals: { fertilizer: 14, repot: 365 },
  },
  {
    name: '무화과나무',
    latin: 'Ficus carica',
    pot: '외경 24cm',
    water_summer_days: 3,
    water_winter_days: 12,
    water_amount: '1.4~1.6L',
    light: '직사광 선호. 부족 시 열매 안 달림',
    fertilizer: '봄~초여름 균형 비료, 열매기 칼륨 위주. 완효성 고형비료 월 1회',
    cautions: '배수 확실히. 겨울 낙엽은 휴면이라 정상. 뿌리 꽉 차면 봄에 분갈이',
    special_checks: ['열매 상태', '뿌리가 배수구로 나왔는지'],
    activities: ['water', 'fertilizer', 'repot', 'bloom', 'prune'],
    intervals: { fertilizer: 30, repot: 365 },
  },
  {
    name: '로즈마리',
    latin: 'Salvia rosmarinus',
    pot: '소형',
    water_summer_days: 4,
    water_winter_days: 10,
    water_amount: '250mL',
    light: '햇빛 매우 좋아함. 부족 시 웃자람, 향 약화',
    fertilizer: '요구 적음. 봄~여름 묽은 액비 월 1회. 과비 금물(향 저하)',
    cautions:
      '과습이 고사 1순위. 겉흙 완전히 마른 뒤에만 급수. 통풍 필수(흰가루병)',
    special_checks: ['흰가루병 흔적', '줄기 아래쪽 갈변 여부'],
    activities: ['water', 'fertilizer', 'repot', 'prune', 'harvest', 'pest'],
    intervals: { fertilizer: 30, repot: 365 },
  },
  {
    name: '몬스테라',
    latin: 'Monstera deliciosa',
    pot: '외경 19cm',
    water_summer_days: 6,
    water_winter_days: 12,
    water_amount: '700~900mL',
    light: '밝은 간접광. 직사광은 잎 탐, 어두우면 갈라짐 안 생김',
    fertilizer: '관엽용 균형 액비, 봄~여름 2주 1회',
    cautions:
      '과습 시 뿌리 썩음·검은 반점. 주 1회 화분 돌리기. 자라면 이끼봉 지지대',
    special_checks: ['새잎 갈라짐 진행', '잎 기울기(빛 쏠림)', '공중뿌리 상태'],
    activities: ['water', 'fertilizer', 'repot', 'rotate', 'growth'],
    intervals: { fertilizer: 14, repot: 365 },
  },
]

// 모든 식물 공통 기본 점검 항목
export const DEFAULT_CHECK_ITEMS = [
  '잎 상태 (노란 잎·검은 반점·처짐)',
  '병충해 (응애·깍지벌레·흰가루병 흔적)',
  '흙 상태 (속흙 마름 - 젓가락 테스트)',
  '받침 물 고임 여부',
  '통풍/위치 적절성',
]
