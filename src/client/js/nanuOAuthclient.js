// 언어를 설정하는 함수
function setLanguage(lang) {
  localStorage.setItem('preferredLanguage', lang);
}

// 언어를 가져오는 함수
function getLanguage() {
  return localStorage.getItem('preferredLanguage') || 'en'; // 기본값은 영어
}

// 번역 파일을 로드하는 함수
async function loadTranslations(lang) {
  try {
    const response = await fetch(`./lang/${lang}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load ${lang}.json`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading translations:', error);
    return {};
  }
}

function getQueryParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// GET으로 넘어온 값들을 변수에 저장
const appName = getQueryParameter('app_name');
const app_id = getQueryParameter('app_id');
const redirect_uri = getQueryParameter('redirect_uri');
const API_ENDPOINT = 'https://auth.nanu.cc/api/oauth/login'

// 값이 없으면 오류 처리
if (!appName || !app_id || !redirect_uri) {
  alert('서비스 인증에 실패했어요')
  window.location.href = 'https://static-gp.ncloud.sbs/code/500/';
} else {
  document.getElementById('applicationName').textContent = appName;
}

// UI 업데이트 함수
async function updateUI() {
  const lang = getLanguage();
  const translations = await loadTranslations(lang);

  document.querySelectorAll('[data-sys-lang]').forEach(element => {
    const key = element.getAttribute('data-sys-lang');
    if (translations[key]) {
      element.textContent = translations[key];
    }
  });

  // 언어 선택기 초기화
  document.getElementById('languageSelector').value = lang;
}

// 현재 단계 (ID -> PW -> PIN)
let currentStep = 0;

// 애니메이션 클래스 리셋 함수
function resetAnimation(element) {
  element.style.animation = 'none';
  element.offsetHeight; // 리플로우 강제 적용
  element.style.animation = null;
}

// 단계별 화면 전환 함수
function updateFormStep(step) {
  const authContainer = document.querySelector('.auth-container');
  const formTitle = document.getElementById('formTitle');
  const backButton = document.getElementById('backButton');
  const nextButton = document.getElementById('nextButton');

  const titles = ['usernameTitle', 'passwordTitle', 'pinTitle'];

  // 애니메이션 리셋 및 재설정
  resetAnimation(authContainer);
  authContainer.style.animation = 'slide-up 0.4s ease-out';

  // 각 단계별로 필요한 요소만 보여주기
  document.getElementById('usernameGroup').style.display = step === 0 ? 'block' : 'none';
  document.getElementById('passwordGroup').style.display = step === 1 ? 'block' : 'none';
  document.getElementById('pinGroup').style.display = step === 2 ? 'block' : 'none';

  // 폼 타이틀 설정
  formTitle.setAttribute('data-sys-lang', titles[step]);

  backButton.style.display = step > 0 ? 'inline-block' : 'none';
  nextButton.setAttribute('data-sys-lang', step < 2 ? 'nextButton' : 'loginButton');
  updateUI(); // UI 업데이트 (언어팩 적용)
}

// 서버로 아이디와 비밀번호를 보내는 함수
async function submitCredentials(user_email, user_password) {
  try {
    const token = grecaptcha.getResponse(); // reCAPTCHA 응답 토큰 가져오기
    if (!token) {
      displayError('Please complete the reCAPTCHA.');
      return;
    }

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_email, user_password, token ,app_id,redirect_uri })
    });

    const result = await response.json();

    if (response.ok) {
      window.location.href = result.moveto;
    } else {
      displayError(result.message || 'Login failed. Please try again.');
    }
  } catch (error) {
    console.error('Error submitting credentials:', error);
    displayError('An error occurred. Please try again later.');
  }
}

// 에러 메시지를 표시하는 함수
function displayError(message) {
  const errorMessageElement = document.getElementById('errorMessage');
  errorMessageElement.textContent = message;
  errorMessageElement.style.display = 'block';
}

// 언어 변경 이벤트 리스너
document.getElementById('languageSelector').addEventListener('change', (event) => {
  const newLang = event.target.value;
  setLanguage(newLang);
  updateUI(); // 언어를 변경한 후 UI를 업데이트
});

// 다음 버튼 클릭 이벤트 리스너
document.getElementById('nextButton').addEventListener('click', () => {
  if (currentStep === 0) {
    const username = document.getElementById('username').value;
    if (!username) {
      displayError('Username is required');
      return;
    }
    currentStep++;
  } else if (currentStep === 1) {
    const password = document.getElementById('password').value;
    if (!password) {
      displayError('Password is required');
      return;
    }
    currentStep++;
  } else if (currentStep === 2) {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    submitCredentials(username, password);
    return;
  }
  updateFormStep(currentStep);
});

// 뒤로가기 버튼 클릭 이벤트 리스너
document.getElementById('backButton').addEventListener('click', () => {
  if (currentStep > 0) {
    currentStep--;
    updateFormStep(currentStep);
  }
});

// 엔터 키를 눌렀을 때 다음 단계로 넘어가게 하는 함수
let isProcessingEnter = false;

// 엔터 키를 눌렀을 때 다음 단계로 넘어가게 하는 함수
function handleEnterKey(event) {
  if (event.key === 'Enter') {
    // 엔터 키가 이미 눌렸다면 무시
    if (isProcessingEnter) {
      return;
    }
    isProcessingEnter = true;

    // 현재 단계에 따라 다음 버튼 클릭
    document.getElementById('nextButton').click();
  }
}

// 엔터 키에서 손을 뗄 때 상태 변수 해제
function handleKeyUp(event) {
  if (event.key === 'Enter') {
    isProcessingEnter = false;
  }
}

// 각 입력 필드에 엔터 키 이벤트 리스너 추가
document.getElementById('username').addEventListener('keydown', handleEnterKey);
document.getElementById('username').addEventListener('keyup', handleKeyUp);

document.getElementById('password').addEventListener('keydown', handleEnterKey);
document.getElementById('password').addEventListener('keyup', handleKeyUp);


// 페이지 로드 시 초기 설정
document.addEventListener('DOMContentLoaded', () => {
  updateUI();
  updateFormStep(currentStep);
});
