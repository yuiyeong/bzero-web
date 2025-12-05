# Supabase 이메일 템플릿 설정

## 이메일 인증 템플릿 수정 방법

### 1. Supabase 대시보드 접속

1. [Supabase 대시보드](https://supabase.com/dashboard)에 접속
2. 프로젝트 선택

### 2. 이메일 템플릿 설정

1. 좌측 메뉴에서 **Authentication** 클릭
2. **Email Templates** 탭 클릭
3. **Confirm signup** 템플릿 선택

### 3. 템플릿 내용 수정

#### 템플릿

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>B0 이메일 인증</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', dotum, sans-serif; line-height: 1.6;">
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        
        <tr>
            <td style="background-color: #2b2e4a; padding: 40px 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 2px;">B0 : 지하 0층</h1>
                <p style="color: #aeb4d1; margin: 10px 0 0 0; font-size: 14px;">일상 아래 숨겨진 당신만의 휴식처</p>
            </td>
        </tr>

        <tr>
            <td style="padding: 40px 30px; color: #333333;">
                <h2 style="font-size: 20px; color: #2b2e4a; margin-bottom: 20px;">안녕하세요, 여행자님! 🎈</h2>
                
                <p style="margin-bottom: 20px;">
                    우연히 발견한 <strong>지하 0층(B0)</strong>에 오신 것을 환영합니다.<br>
                    이곳은 일상에 지친 당신을 위해 준비된 비밀스러운 비행선 터미널입니다.
                </p>
                
                <p style="margin-bottom: 30px;">
                    지금 비행선이 이세계 도시들로 떠날 준비를 마쳤습니다.<br>
                    아래 버튼을 눌러 <strong>이메일 인증</strong>을 완료하고,<br>
                    새로운 사람들과의 만남과 깊은 휴식을 시작해 보세요.
                </p>

                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td align="center" style="padding: 20px 0 40px 0;">
                            <a href="{{ .ConfirmationURL }}" target="_blank" style="background-color: #536dfe; color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(83, 109, 254, 0.3);">
                                탑승 수속 완료하기
                            </a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
                <p style="font-size: 12px; color: #999999; margin: 0 0 10px 0;">
                    본 메일은 B0 가입 인증을 위해 발송되었습니다.<br>
                    본인이 요청하지 않았다면 이 메일을 무시해 주세요.
                </p>
                <p style="font-size: 12px; color: #bbbbbb; margin: 0;">
                    © B0 Team. All rights reserved.
                </p>
            </td>
        </tr>
    </table>
    
    <div style="height: 40px;"></div>

</body>
</html>
```

### 4. Redirect URL 설정

1. **URL Configuration** 섹션에서
2. **Site URL** 설정:
   - 프로덕션: `https://app.basementzero.cloud`
3. **Redirect URLs** 추가:
   - `https://app.basementzero.cloud/**`
   - `http://localhost:5173/**`

### 5. 저장 및 테스트

1. **Save** 버튼 클릭
2. 테스트 회원가입으로 이메일 템플릿 확인
