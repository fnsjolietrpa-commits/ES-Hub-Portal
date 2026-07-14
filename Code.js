// 팀장님 이메일 (여러 명이면 콤마로 추가)
const MANAGER_EMAILS = ['hana.oh@fnsusa.com'];

const PAGE_MAP = {
  'guide-rename': {
    file: 'guide-rename',
    title: '선적서류 파일명 컨버터 - 가이드'
  },
  'guide-ciplupload': {
    file: 'guide-ciplupload',
    title: 'WMS CIPL Uploader - 사용 가이드'
  },
  'guide-qclabel_yellow': {
    file: 'guide-qclabel_yellow',
    title: 'QC 라벨 생성기 - 가이드'
  },
  'guide-nerp_downloader': {
    file: 'guide-nerp_downloader',
    title: 'IB Data Downloader - 가이드'
  },
  'guide-bol_merger': {
    file: 'guide-bol_merger',
    title: 'BOL merger - 가이드'
  },
    'guide-fg_report_downloader': {
    file: 'guide-fg_report_downloader',
    title: 'FG Report Downloader - 가이드'
  },
  'guide-nerp_unboxing_live_delete': {
    file: 'guide-nerp_unboxing_live_delete',
    title: 'NERP Unboxing Automation - 가이드'
  },

};

function doGet(e) {
  const page = (e && e.parameter && e.parameter.page) ? String(e.parameter.page) : '';

  if (PAGE_MAP[page]) {
    return HtmlService.createHtmlOutputFromFile(PAGE_MAP[page].file)
      .setTitle(PAGE_MAP[page].title)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('FNS Chicago Hub')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getPortalData() {
  const appPayload = getApps();

  return {
    email: appPayload.email,
    isManager: appPayload.isManager,
    apps: appPayload.apps,
    updates: getRecentUpdates()
  };
}

function getApps() {
  const email = (Session.getActiveUser().getEmail() || '').trim();
  const isManager = isManagerUser_(email);
  const baseUrl = ScriptApp.getService().getUrl();

  const all = [
      {
      id: 'location-dashboard',
      name: '로케이션 활용 대시보드',
      desc: '창고 로케이션 활용 현황',
      url: 'https://script.google.com/macros/s/AKfycbwB0GI742d0fuCW17KxQ4UiJEusSf-fXg5kHSaU9HON8oLbk3YdOzBaGlOslJvp6yg/exec',
      icon: '📍',
      category: 'IB',
      managerOnly: false
    },
        {
      id: 'QC-Label-Generator',
      name: 'QC 라벨 생성기',
      desc: 'Busbar A&B, MICA QC라벨 생성',
      url: baseUrl + '?page=guide-qclabel_yellow',
      icon: '🏷️',
      category: 'VAS',
      managerOnly: false
    },
    {
      id: 'dispatch-automation',
      name: '배차 자동화',
      desc: '배차 작업 자동 처리',
      url: 'https://script.google.com/macros/s/AKfycbyHxVKdSXRFihmenOUJw-zPfjUoJnZ2N2cEKqSFvZoz0-4n3MwybJaK7drIYYBErRnm/exec',
      icon: '🚚',
      category: 'OB',
      managerOnly: false
    },
    {
      id: 'ob-file-converter',
      name: 'OB 파일 포메터',
      desc: '아웃바운드 파일 형식 변환',
      url: 'https://script.google.com/macros/s/AKfycbzlDkp-JPZLT7Pz-F5GprfjxrepnbImgLqxrd1XIFjRLtcMTTqLRasWzP-lcs3O6kd5/exec',
      icon: '🔄',
      category: 'OB',
      managerOnly: false
    },
    {
      id: 'fareclock-dashboard',
      name: 'fareclock 인건비 대시보드',
      desc: '근태 기반 인건비 분석',
      url: 'https://script.google.com/macros/s/AKfycbwiu7VVLgmBMzHOVM04-2fk_3g_5Fr0nfBn4GQ9IQpa4n3zhBBjuB7TmWwsy_nwqoRkfA/exec',
      icon: '💰',
      category: '관리',
      managerOnly: false
    },
    {
      id: 'shipping-name-converter',
      name: '선적서류 파일명 컨버터',
      desc: '서류 파일명을 PO + HBL 로 변환',
      url: baseUrl + '?page=guide-rename',
      icon: '➗',
      category: 'OB',
      managerOnly: false
    },
    {
      id: 'wms-doc-uploader',
      name: 'WMS 선적서류 업로더',
      desc: '선적 서류를 WMS에 자동 업로드',
      url: baseUrl + '?page=guide-ciplupload',
      icon: '💻',
      category: 'OB',
      managerOnly: false
    },
    {
      id: 'IB-Data-Downloader',
      name: 'IB data 다운로더',
      desc: '입고 내역 자동 다운로드',
      url: baseUrl + '?page=guide-nerp_downloader',
      icon: '💾',
      category: 'IB',
      managerOnly: false
    },
    {
      id: 'bol_merger',
      name: 'BOL merger',
      desc: '여러개의 BOL을 체크리스트와 함께 출력',
      url: baseUrl + '?page=guide-bol_merger',
      icon: '📄',
      category: 'OB',
      managerOnly: false
    },
    {
      id: 'fg_report_downloader',
      name: 'FG Report Downloader',
      desc: 'FG 리포트 다운로드 & 정리된 Excel 파일로 저장',
      url: baseUrl + '?page=guide-fg_report_downloader',
      icon: '🔽',
      category: 'FG',
      managerOnly: false
    },
    {
      id: 'nerp-unboxing-live-delete',
      name: 'NERP Unboxing Automation',
      desc: '팔렛 언박싱(Box Data 삭제) 요청서 → 검토 → 실행 자동화',
      url: baseUrl + '?page=guide-nerp_unboxing_live_delete',
      icon: '📦',
      category: 'VAS',
      managerOnly: false
    },
    {
      id: 'FG Portal',
      name: 'FG Portal',
      desc: 'FG 물동량 & 로케이션 사용률 관리',
      url: baseUrl + 'https://script.google.com/macros/s/AKfycbzq1QVwr0vN9MsrlnTFBa1nVtaaVI1gw3Je8yYFrlVHARCIRV96Ab6dsSAsTVijekie/exec',
      icon: '📊',
      category: 'FG',
      managerOnly: false
    },
    {
      id: 'guide_totebox',
      name: 'Totebox 관리 RPA',
      desc: 'PWS/MI 공장 토트박스 초과재고 산출 및 담당자 이메일 발송',
      url: baseUrl + '?page=guide_totebox',
      icon: '✉️',
      category: 'VAS',
      managerOnly: false
    },
    {
      id: 'guide_pws_inventory',
      name: 'PWS 재고 현황 리포트',
      desc: 'PWS 자재별 재고일수 산출 및 담당자 이메일 발송',
      url: baseUrl + '?page=guide_pws_inventory',
      icon: '✉️',
      category: 'VAS',
      managerOnly: false
    },
    {
      id: 'guide_fareclock_today',
      name: 'FareClock 클락인 현황',
      desc: '오늘자 출근 인원 집계 및 관리자 이메일 발송',
      url: baseUrl + '?page=guide_fareclock_today',
      icon: '✉️',
      category: '관리',
      managerOnly: false
    },
    {
      id: 'guide_fareclock_daily',
      name: ' FareClock 데일리 타임카드 리포트',
      desc: 'FG 물동량 & 로케이션 사용률 관리',
      url: baseUrl + '?page=guide_fareclock_daily',
      icon: '✉️',
      category: '관리',
      managerOnly: false
    }
  ];

  const visible = all.filter(function(app) {
    return !app.managerOnly || isManager;
  });

  return {
    email: email,
    isManager: isManager,
    apps: visible
  };
}

function getRecentUpdates() {
  return [

    {
      date: '2026-06-16',
      tag: 'NEW',
      title: 'IB Data Downloader',
      desc: 'IB Data를 자동으로 다운로드 해주는 프로그램을 개발하였습니다.'
    },
    {
      date: '2026-06-16',
      tag: 'Updated',
      title: '선적서류 PO변환',
      desc: 'HBL대신 MBL을 가져오는 오류를 수정하였습니다. 직관적인 팝업 알림을 추가하였습니다.'
    },
    {
      date: '2026-06-16',
      tag: 'NEW',
      title: 'BOL merger',
      desc: 'Seal # 자동 입력 및 뒷면 체크리스트 포함하여 여러개의 BOL을 한번에 출력하는 BOL merger를 개발하였습니다.'
    }  

  ];
}

function isManagerUser_(email) {
  if (!email) return false;

  const normalized = String(email).toLowerCase().trim();
  return MANAGER_EMAILS
    .map(function(item) { return String(item).toLowerCase().trim(); })
    .indexOf(normalized) !== -1;
}
