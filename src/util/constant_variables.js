export default class Constant {
    static serviceURL = "http://localhost:8080";

    static inquiryURL = "/inquiry";
    static userURL = "/user";
    static mypageURL = "/mypage";


    static getSideMenus() {
        return [
            { key: 0, name: "개발과정", href: "/DevelopPage" },
            { key: 1, name: "로그인", href: "/LoginPage" },
            { key: 3, name: "조회", href: "/InquiryPage" },
            { key: 4, name: "마이페이지", href: "/MyPage" },
            // { key: 4, name: "Signup", href: "/SignupPage" },
        ];
    }

    static getHowManyBed() {
        return [
            { key: 0, value: "Single Bed"},
            { key: 1, value: "Double Bed"},
            { key: 2, value: "Twin Bed"},
            { key: 3, value: "Triple Bed" },
            { key: 4, value: "Family Bed" },
        ];
    }
    // static getHowManyBed() {
    //     return [
    //         { key: 0, value: 1, name: "Single Bed" },
    //         { key: 1, value: 2, name: "Double Bed" },
    //         { key: 2, value: 2, name: "Twin Bed" },
    //         { key: 3, value: 3, name: "Triple Bed" },
    //         { key: 4, value: 4, name: "Family Bed" },
    //     ];
    // }
    static getFilterMenus() {
        return [
            { key: 0, value: 0, name: "원래대로" },
            { key: 1, value: 1, name: "높은순" },
            { key: 2, value: 2, name: "낮은순" },
            { key: 3, value: 3, name: "가나다순" },
            { key: 4, value: 4, name: "다나가순" },
        ];
    }

    static getEmailMenus() {
        return [
            { key: 0, value: "naver.com" },
            { key: 1, value: "gmail.com" },
            { key: 2, value: "nate.com" },
            { key: 3, value: "hanmail.com" },

        ];
    }
    static getPhoneNumber() {
        return [
            { key: 0, value: "010" },
            { key: 1, value: "011" },
            { key: 2, value: "016" },
            { key: 3, value: "017" },
            { key: 4, value: "018" },
            { key: 5, value: "019" },
            { key: 6, value: "070" },

        ];
    }
    static getMyPageStatus() {
        return [
            { key: 1, value: 1, name: "예약목록" },
            { key: 2, value: 2, name: "회원정보" },
            { key: 3, value: 3, name: "로그아웃" },
        ];
    }
}