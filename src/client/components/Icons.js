import React from 'react';
import tw from 'tailwind-styled-components';

const Icon = tw.div`
    flex
`
export default Icon;

export class SearchIcon extends React.Component {

    constructor(props) { super(props) }
    static defaultProps = {
        className: "",
        width: 16,
        height: 16,
        stroke: "black",
    }

    render() {
        const { className, width, height, stroke } = this.props;
        return (
            <svg className={className} width={width} height={height}
                viewBox="0 0 16 16" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M15.7779 14.6511L12.8112 11.7067C13.9628 10.2699 14.5205 8.44635 14.3696 6.61085C14.2187 4.77535 13.3707 3.06745 12 1.83834C10.6293 0.609226 8.83997 -0.0476794 7.00005 0.00269722C5.16014 0.0530739 3.40943 0.806903 2.10793 2.10918C0.806424 3.41146 0.0530423 5.1632 0.00269561 7.00421C-0.0476511 8.84523 0.608864 10.6356 1.83725 12.0071C3.06563 13.3787 4.77251 14.2272 6.60692 14.3781C8.44134 14.5291 10.2638 13.9711 11.6997 12.8188L14.6424 15.7633C14.7168 15.8383 14.8052 15.8978 14.9027 15.9385C15.0001 15.9791 15.1046 16 15.2102 16C15.3158 16 15.4203 15.9791 15.5177 15.9385C15.6152 15.8978 15.7036 15.8383 15.7779 15.7633C15.9221 15.6141 16.0026 15.4147 16.0026 15.2072C16.0026 14.9997 15.9221 14.8003 15.7779 14.6511ZM7.21362 12.8188C6.10652 12.8188 5.02429 12.4903 4.10377 11.8749C3.18325 11.2595 2.46579 10.3847 2.04212 9.36129C1.61845 8.33786 1.5076 7.2117 1.72358 6.12523C1.93957 5.03875 2.47269 4.04076 3.25553 3.25746C4.03836 2.47416 5.03576 1.94072 6.12159 1.72461C7.20741 1.50849 8.3329 1.61941 9.35573 2.04333C10.3786 2.46725 11.2528 3.18514 11.8679 4.1062C12.4829 5.02727 12.8112 6.11015 12.8112 7.21791C12.8112 8.70337 12.2215 10.128 11.1717 11.1784C10.122 12.2287 8.6982 12.8188 7.21362 12.8188Z" fill={stroke} />
            </svg>
        )
    }
}

export class ShareIcon extends React.Component {

    constructor(props) { super(props) }
    static defaultProps = {
        className: "",
        width: 16,
        height: 16,
        stroke: "black",
    }

    render() {
        const { className, width, height, stroke } = this.props;
        return (
            <svg className={className} width={width} height={height}
                viewBox="0 0 18 18" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M17 11.6667V15.2222C17 15.6937 16.8127 16.1459 16.4793 16.4793C16.1459 16.8127 15.6937 17 15.2222 17H2.77778C2.30628 17 1.8541 16.8127 1.5207 16.4793C1.1873 16.1459 1 15.6937 1 15.2222V11.6667M13.4444 5.44444L9 1M9 1L4.55556 5.44444M9 1V11.6667" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }
}

export class NotificationIcon extends React.Component {

    constructor(props) { super(props) }
    static defaultProps = {
        className: "",
        width: 16,
        height: 16,
        stroke: "black",
    }

    render() {
        const { className, width, height, stroke } = this.props;
        return (
            <svg className={className} width={width} height={height}
                viewBox="0 0 17 18" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M9.98552 16.2027C9.84484 16.4452 9.64293 16.6465 9.39999 16.7864C9.15706 16.9263 8.88162 17 8.60127 17C8.32092 17 8.04548 16.9263 7.80255 16.7864C7.55961 16.6465 7.3577 16.4452 7.21703 16.2027M13.4021 5.80085C13.4021 4.52759 12.8963 3.30647 11.996 2.40614C11.0957 1.5058 9.87454 1 8.60127 1C7.32801 1 6.10689 1.5058 5.20656 2.40614C4.30622 3.30647 3.80042 4.52759 3.80042 5.80085C3.80042 11.4018 1.39999 13.0021 1.39999 13.0021H15.8025C15.8025 13.0021 13.4021 11.4018 13.4021 5.80085Z" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }
}

export class SettingsIcon extends React.Component {

    constructor(props) { super(props) }
    static defaultProps = {
        className: "",
        width: 17,
        height: 17,
        stroke: "black",
    }

    render() {
        const { className, width, height, stroke } = this.props;
        return (
            <svg className={className} width={width} height={height}
                viewBox="0 0 18 18" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M9.20001 11.1818C10.405 11.1818 11.3818 10.205 11.3818 9C11.3818 7.79502 10.405 6.81818 9.20001 6.81818C7.99503 6.81818 7.01819 7.79502 7.01819 9C7.01819 10.205 7.99503 11.1818 9.20001 11.1818Z" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14.5818 11.1818C14.485 11.4012 14.4561 11.6445 14.4989 11.8804C14.5417 12.1164 14.6542 12.3341 14.8218 12.5055L14.8655 12.5491C15.0007 12.6842 15.108 12.8446 15.1812 13.0212C15.2544 13.1978 15.2921 13.387 15.2921 13.5782C15.2921 13.7693 15.2544 13.9586 15.1812 14.1352C15.108 14.3118 15.0007 14.4722 14.8655 14.6073C14.7304 14.7425 14.57 14.8498 14.3934 14.923C14.2168 14.9962 14.0275 15.0339 13.8364 15.0339C13.6452 15.0339 13.456 14.9962 13.2794 14.923C13.1028 14.8498 12.9424 14.7425 12.8073 14.6073L12.7636 14.5636C12.5922 14.396 12.3745 14.2835 12.1386 14.2407C11.9027 14.1979 11.6594 14.2268 11.44 14.3236C11.2249 14.4158 11.0415 14.5689 10.9122 14.764C10.783 14.9591 10.7137 15.1878 10.7127 15.4218V15.5455C10.7127 15.9312 10.5595 16.3012 10.2867 16.574C10.0139 16.8468 9.64396 17 9.25819 17C8.87242 17 8.50246 16.8468 8.22968 16.574C7.9569 16.3012 7.80365 15.9312 7.80365 15.5455V15.48C7.79802 15.2393 7.7201 15.0058 7.58002 14.81C7.43994 14.6141 7.24418 14.4649 7.01819 14.3818C6.79884 14.285 6.55551 14.2561 6.31958 14.2989C6.08366 14.3417 5.86596 14.4542 5.69456 14.6218L5.65092 14.6655C5.51583 14.8007 5.35541 14.908 5.17883 14.9812C5.00226 15.0544 4.81298 15.0921 4.62183 15.0921C4.43068 15.0921 4.24141 15.0544 4.06483 14.9812C3.88825 14.908 3.72783 14.8007 3.59274 14.6655C3.4575 14.5304 3.35022 14.3699 3.27702 14.1934C3.20382 14.0168 3.16614 13.8275 3.16614 13.6364C3.16614 13.4452 3.20382 13.2559 3.27702 13.0794C3.35022 12.9028 3.4575 12.7424 3.59274 12.6073L3.63638 12.5636C3.80404 12.3922 3.91651 12.1745 3.95929 11.9386C4.00207 11.7027 3.97319 11.4594 3.87638 11.24C3.78418 11.0249 3.63111 10.8414 3.43599 10.7122C3.24087 10.583 3.01222 10.5137 2.77819 10.5127H2.65456C2.26879 10.5127 1.89882 10.3595 1.62604 10.0867C1.35326 9.81392 1.20001 9.44395 1.20001 9.05818C1.20001 8.67241 1.35326 8.30244 1.62604 8.02966C1.89882 7.75688 2.26879 7.60364 2.65456 7.60364H2.72001C2.96074 7.59801 3.1942 7.52009 3.39005 7.38001C3.5859 7.23993 3.73508 7.04417 3.81819 6.81818C3.91501 6.59882 3.94388 6.3555 3.90111 6.11957C3.85833 5.88365 3.74586 5.66595 3.57819 5.49455L3.53456 5.45091C3.39932 5.31582 3.29203 5.1554 3.21883 4.97882C3.14564 4.80224 3.10796 4.61297 3.10796 4.42182C3.10796 4.23067 3.14564 4.04139 3.21883 3.86481C3.29203 3.68824 3.39932 3.52782 3.53456 3.39273C3.66965 3.25749 3.83007 3.1502 4.00664 3.077C4.18322 3.00381 4.3725 2.96613 4.56365 2.96613C4.7548 2.96613 4.94407 3.00381 5.12065 3.077C5.29723 3.1502 5.45765 3.25749 5.59274 3.39273L5.63638 3.43636C5.80778 3.60403 6.02548 3.7165 6.2614 3.75928C6.49733 3.80205 6.74066 3.77317 6.96001 3.67636H7.01819C7.2333 3.58417 7.41675 3.43109 7.54597 3.23597C7.67519 3.04085 7.74453 2.81221 7.74547 2.57818V2.45455C7.74547 2.06878 7.89871 1.69881 8.17149 1.42603C8.44427 1.15325 8.81424 1 9.20001 1C9.58578 1 9.95575 1.15325 10.2285 1.42603C10.5013 1.69881 10.6546 2.06878 10.6546 2.45455V2.52C10.6555 2.75403 10.7248 2.98267 10.8541 3.17779C10.9833 3.37291 11.1667 3.52599 11.3818 3.61818C11.6012 3.71499 11.8445 3.74387 12.0804 3.70109C12.3164 3.65832 12.5341 3.54585 12.7055 3.37818L12.7491 3.33455C12.8842 3.19931 13.0446 3.09202 13.2212 3.01882C13.3978 2.94562 13.587 2.90795 13.7782 2.90795C13.9693 2.90795 14.1586 2.94562 14.3352 3.01882C14.5118 3.09202 14.6722 3.19931 14.8073 3.33455C14.9425 3.46963 15.0498 3.63005 15.123 3.80663C15.1962 3.98321 15.2339 4.17249 15.2339 4.36364C15.2339 4.55479 15.1962 4.74406 15.123 4.92064C15.0498 5.09722 14.9425 5.25764 14.8073 5.39273L14.7636 5.43636C14.596 5.60777 14.4835 5.82547 14.4407 6.06139C14.398 6.29731 14.4268 6.54064 14.5236 6.76V6.81818C14.6158 7.03329 14.7689 7.21674 14.964 7.34596C15.1592 7.47518 15.3878 7.54452 15.6218 7.54545H15.7455C16.1312 7.54545 16.5012 7.6987 16.774 7.97148C17.0468 8.24426 17.2 8.61423 17.2 9C17.2 9.38577 17.0468 9.75574 16.774 10.0285C16.5012 10.3013 16.1312 10.4545 15.7455 10.4545H15.68C15.446 10.4555 15.2173 10.5248 15.0222 10.654C14.8271 10.7833 14.674 10.9667 14.5818 11.1818Z" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }
}

export class AddIcon extends React.Component {

    constructor(props) { super(props) }
    static defaultProps = {
        className: "",
        width: 16,
        height: 16,
        stroke: "black",
    }

    render() {
        const { className, width, height, stroke } = this.props;
        return (
            <svg
                className={className} width={width} height={height}
                viewBox="0 0 12 12" fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M11.25 5.25H6.75V0.75C6.75 0.551088 6.67098 0.360322 6.53033 0.21967C6.38968 0.0790178 6.19891 0 6 0C5.80109 0 5.61032 0.0790178 5.46967 0.21967C5.32902 0.360322 5.25 0.551088 5.25 0.75V5.25H0.75C0.551088 5.25 0.360322 5.32902 0.21967 5.46967C0.0790178 5.61032 0 5.80109 0 6C0 6.19891 0.0790178 6.38968 0.21967 6.53033C0.360322 6.67098 0.551088 6.75 0.75 6.75H5.25V11.25C5.25 11.4489 5.32902 11.6397 5.46967 11.7803C5.61032 11.921 5.80109 12 6 12C6.19891 12 6.38968 11.921 6.53033 11.7803C6.67098 11.6397 6.75 11.4489 6.75 11.25V6.75H11.25C11.4489 6.75 11.6397 6.67098 11.7803 6.53033C11.921 6.38968 12 6.19891 12 6C12 5.80109 11.921 5.61032 11.7803 5.46967C11.6397 5.32902 11.4489 5.25 11.25 5.25Z" fill={stroke} />
            </svg>
        );
    }
}

export class FolderIcon extends React.Component {

    constructor(props) { super(props) }
    static defaultProps = {
        className: "",
        width: 16,
        height: 14,
        stroke: "black",
    }

    render() {
        const { className, width, height, stroke } = this.props;
        return (
            <svg className={className} width={width} height={height}
                viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.3333 11.6667C14.3333 12.0203 14.1929 12.3594 13.9428 12.6095C13.6928 12.8595 13.3536 13 13 13H2.33333C1.97971 13 1.64057 12.8595 1.39052 12.6095C1.14048 12.3594 1 12.0203 1 11.6667V2.33333C1 1.97971 1.14048 1.64057 1.39052 1.39052C1.64057 1.14048 1.97971 1 2.33333 1H5.66667L7 3H13C13.3536 3 13.6928 3.14048 13.9428 3.39052C14.1929 3.64057 14.3333 3.97971 14.3333 4.33333V11.6667Z" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }
}

export class DeleteIcon extends React.Component {

    constructor(props) { super(props) }
    static defaultProps = {
        className: "",
        width: 14,
        height: 14,
        stroke: "black",
    }

    render() {
        const { className, width, height, stroke } = this.props;
        return (
            <svg className={className} width={width} height={height}
                viewBox="0 0 13 14" fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M11.9 2.8H9.1V2.1C9.1 1.54305 8.87875 1.0089 8.48492 0.615076C8.0911 0.221249 7.55695 0 7 0H5.6C5.04305 0 4.5089 0.221249 4.11508 0.615076C3.72125 1.0089 3.5 1.54305 3.5 2.1V2.8H0.7C0.514348 2.8 0.336301 2.87375 0.205025 3.00503C0.0737498 3.1363 0 3.31435 0 3.5C0 3.68565 0.0737498 3.8637 0.205025 3.99497C0.336301 4.12625 0.514348 4.2 0.7 4.2H1.4V11.9C1.4 12.457 1.62125 12.9911 2.01508 13.3849C2.4089 13.7788 2.94305 14 3.5 14H9.1C9.65696 14 10.1911 13.7788 10.5849 13.3849C10.9788 12.9911 11.2 12.457 11.2 11.9V4.2H11.9C12.0857 4.2 12.2637 4.12625 12.395 3.99497C12.5263 3.8637 12.6 3.68565 12.6 3.5C12.6 3.31435 12.5263 3.1363 12.395 3.00503C12.2637 2.87375 12.0857 2.8 11.9 2.8ZM4.9 2.1C4.9 1.91435 4.97375 1.7363 5.10503 1.60503C5.2363 1.47375 5.41435 1.4 5.6 1.4H7C7.18565 1.4 7.3637 1.47375 7.49497 1.60503C7.62625 1.7363 7.7 1.91435 7.7 2.1V2.8H4.9V2.1ZM9.8 11.9C9.8 12.0857 9.72625 12.2637 9.59498 12.395C9.4637 12.5263 9.28565 12.6 9.1 12.6H3.5C3.31435 12.6 3.1363 12.5263 3.00503 12.395C2.87375 12.2637 2.8 12.0857 2.8 11.9V4.2H9.8V11.9Z" fill={stroke} />
            </svg>
        );
    }
}

export class EditIcon extends React.Component {

    constructor(props) { super(props) }
    static defaultProps = {
        className: "",
        width: 14,
        height: 14,
        stroke: "black",
    }

    render() {
        const { className, width, height, stroke } = this.props;
        return (
            <svg className={className} width={width} height={height}
                viewBox="0 0 16 16" fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M15.9988 4.1917C15.9994 4.08642 15.9792 3.98206 15.9394 3.8846C15.8996 3.78714 15.841 3.69849 15.7668 3.62374L12.3751 0.231996C12.3003 0.157856 12.2117 0.0992007 12.1142 0.0593919C12.0168 0.0195832 11.9124 -0.000595299 11.8071 1.33704e-05C11.7019 -0.000595299 11.5975 0.0195832 11.5 0.0593919C11.4026 0.0992007 11.3139 0.157856 11.2392 0.231996L0.231996 11.2392C0.157856 11.3139 0.0992007 11.4026 0.0593919 11.5C0.0195832 11.5975 -0.000595299 11.7019 1.33704e-05 11.8071V15.1989C1.33704e-05 15.411 0.0842925 15.6145 0.23431 15.7645C0.384328 15.9145 0.587796 15.9988 0.799954 15.9988H4.1917C4.30363 16.0049 4.4156 15.9874 4.52033 15.9474C4.62507 15.9075 4.72023 15.8459 4.79965 15.7668L13.495 7.02349L15.7668 4.79965C15.8399 4.72213 15.8993 4.63289 15.9428 4.53568C15.9505 4.47191 15.9505 4.40745 15.9428 4.34369C15.9466 4.30645 15.9466 4.26893 15.9428 4.2317L15.9988 4.1917ZM3.86372 14.3989H1.59989V12.1351L9.5433 4.1917L11.8071 6.45553L3.86372 14.3989ZM12.935 5.32762L10.6712 3.06378L11.8071 1.93587L14.063 4.1917L12.935 5.32762Z" fill={stroke} />
            </svg>

        );
    }
}

export class ExpandIcon extends React.Component {

    constructor(props) { super(props) }
    static defaultProps = {
        className: "",
        width: 9,
        height: 14,
        stroke: "black",
    }

    render() {
        const { className, width, height, stroke } = this.props;
        return (
            <svg className={className} width={width} height={height}
                viewBox="0 0 9 15" fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M1.71409 4.7158L4.00409 2.4158L6.29409 4.7158C6.38705 4.80953 6.49766 4.88392 6.61951 4.93469C6.74137 4.98546 6.87208 5.0116 7.00409 5.0116C7.1361 5.0116 7.26681 4.98546 7.38867 4.93469C7.51053 4.88392 7.62113 4.80953 7.71409 4.7158C7.80782 4.62284 7.88221 4.51223 7.93298 4.39038C7.98375 4.26852 8.00989 4.13781 8.00989 4.0058C8.00989 3.87379 7.98375 3.74308 7.93298 3.62122C7.88221 3.49936 7.80782 3.38876 7.71409 3.2958L4.71409 0.295798C4.62113 0.20207 4.51053 0.127676 4.38867 0.0769072C4.26681 0.0261385 4.1361 0 4.00409 0C3.87208 0 3.74137 0.0261385 3.61951 0.0769072C3.49766 0.127676 3.38705 0.20207 3.29409 0.295798L0.294092 3.2958C0.105788 3.4841 0 3.7395 0 4.0058C0 4.2721 0.105788 4.52749 0.294092 4.7158C0.482395 4.9041 0.73779 5.00989 1.00409 5.00989C1.27039 5.00989 1.52579 4.9041 1.71409 4.7158ZM6.29409 9.2958L4.00409 11.5958L1.71409 9.2958C1.62085 9.20256 1.51016 9.1286 1.38834 9.07814C1.26652 9.02768 1.13595 9.00171 1.00409 9.00171C0.872233 9.00171 0.741664 9.02768 0.619842 9.07814C0.49802 9.1286 0.38733 9.20256 0.294092 9.2958C0.200853 9.38904 0.126892 9.49973 0.0764318 9.62155C0.0259714 9.74337 0 9.87394 0 10.0058C0 10.1377 0.0259714 10.2682 0.0764318 10.39C0.126892 10.5119 0.200853 10.6226 0.294092 10.7158L3.29409 13.7158C3.38705 13.8095 3.49766 13.8839 3.61951 13.9347C3.74137 13.9855 3.87208 14.0116 4.00409 14.0116C4.1361 14.0116 4.26681 13.9855 4.38867 13.9347C4.51053 13.8839 4.62113 13.8095 4.71409 13.7158L7.71409 10.7158C7.9024 10.5275 8.00818 10.2721 8.00818 10.0058C8.00818 9.7395 7.9024 9.4841 7.71409 9.2958C7.52579 9.10749 7.27039 9.00171 7.00409 9.00171C6.73779 9.00171 6.4824 9.10749 6.29409 9.2958Z" fill={stroke} />
            </svg>
        );
    }
}

export class CloseIcon extends React.Component {

    constructor(props) { super(props) }
    static defaultProps = {
        className: "",
        width: 16,
        height: 16,
        stroke: "black",
    }

    render() {
        const { className, width, height, stroke } = this.props;
        return (
            <svg
                className={className} width={width} height={height}
                viewBox="0 0 17 17" fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M9.4158 8.00409L15.7158 1.71409C15.9041 1.52579 16.0099 1.27039 16.0099 1.00409C16.0099 0.73779 15.9041 0.482395 15.7158 0.294092C15.5275 0.105788 15.2721 0 15.0058 0C14.7395 0 14.4841 0.105788 14.2958 0.294092L8.0058 6.59409L1.7158 0.294092C1.52749 0.105788 1.2721 2.36434e-07 1.0058 2.38419e-07C0.739497 2.40403e-07 0.484102 0.105788 0.295798 0.294092C0.107495 0.482395 0.00170684 0.73779 0.00170684 1.00409C0.00170684 1.27039 0.107495 1.52579 0.295798 1.71409L6.5958 8.00409L0.295798 14.2941C0.20207 14.3871 0.127676 14.4977 0.0769072 14.6195C0.0261385 14.7414 0 14.8721 0 15.0041C0 15.1361 0.0261385 15.2668 0.0769072 15.3887C0.127676 15.5105 0.20207 15.6211 0.295798 15.7141C0.388761 15.8078 0.499362 15.8822 0.621222 15.933C0.743081 15.9838 0.873786 16.0099 1.0058 16.0099C1.13781 16.0099 1.26852 15.9838 1.39038 15.933C1.51223 15.8822 1.62284 15.8078 1.7158 15.7141L8.0058 9.41409L14.2958 15.7141C14.3888 15.8078 14.4994 15.8822 14.6212 15.933C14.7431 15.9838 14.8738 16.0099 15.0058 16.0099C15.1378 16.0099 15.2685 15.9838 15.3904 15.933C15.5122 15.8822 15.6228 15.8078 15.7158 15.7141C15.8095 15.6211 15.8839 15.5105 15.9347 15.3887C15.9855 15.2668 16.0116 15.1361 16.0116 15.0041C16.0116 14.8721 15.9855 14.7414 15.9347 14.6195C15.8839 14.4977 15.8095 14.3871 15.7158 14.2941L9.4158 8.00409Z" fill={stroke} />
            </svg>

        );
    }
}

export class OpenFolderIcon extends React.Component {

    constructor(props) { super(props) }
    static defaultProps = {
        className: "",
        width: 20,
        height: 16,
        stroke: "black",
    }

    render() {
        const { className, width, height, stroke } = this.props;
        return (
            <svg
                className={className} width={width} height={height}
                viewBox="0 0 25 20" fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M24.2 8.1889C24.0954 8.05999 23.9633 7.95615 23.8133 7.88501C23.6633 7.81386 23.4993 7.77723 23.3333 7.77779H21.1111V6.66668C21.1111 5.78263 20.7599 4.93478 20.1348 4.30966C19.5097 3.68454 18.6618 3.33335 17.7778 3.33335H10.8L10.4444 2.22224C10.2139 1.57028 9.78637 1.00614 9.22099 0.607981C8.65561 0.209823 7.98039 -0.002641 7.28888 2.47817e-05H3.33333C2.44928 2.47817e-05 1.60143 0.351214 0.976309 0.976334C0.351189 1.60145 0 2.4493 0 3.33335V16.6667C0 17.5507 0.351189 18.3986 0.976309 19.0237C1.60143 19.6488 2.44928 20 3.33333 20H19.3333C20.0902 19.9978 20.8238 19.7381 21.4135 19.2635C22.0032 18.7889 22.4138 18.1278 22.5777 17.3889L24.4444 9.13335C24.4782 8.9677 24.4737 8.79653 24.4314 8.63286C24.389 8.4692 24.3099 8.31736 24.2 8.1889ZM4.85555 16.9111C4.7991 17.1618 4.65754 17.3851 4.45496 17.5431C4.25237 17.7011 4.00129 17.7841 3.74444 17.7778H3.33333C3.03864 17.7778 2.75603 17.6607 2.54766 17.4523C2.33928 17.244 2.22222 16.9614 2.22222 16.6667V3.33335C2.22222 3.03867 2.33928 2.75605 2.54766 2.54768C2.75603 2.33931 3.03864 2.22224 3.33333 2.22224H7.28888C7.53118 2.2096 7.77095 2.27661 7.97158 2.41304C8.17222 2.54947 8.32268 2.74782 8.39999 2.9778L8.99999 4.80002C9.07129 5.01196 9.20488 5.19745 9.38329 5.33225C9.5617 5.46705 9.77663 5.54488 9.99999 5.55557H17.7778C18.0724 5.55557 18.3551 5.67264 18.5634 5.88101C18.7718 6.08938 18.8889 6.372 18.8889 6.66668V7.77779H7.77777C7.52092 7.77152 7.26984 7.85444 7.06725 8.01246C6.86467 8.17047 6.7231 8.39381 6.66666 8.64446L4.85555 16.9111ZM20.4111 16.9111C20.3546 17.1618 20.2131 17.3851 20.0105 17.5431C19.8079 17.7011 19.5568 17.7841 19.3 17.7778H6.89999C6.95738 17.654 6.99846 17.5233 7.02221 17.3889L8.66666 10H22L20.4111 16.9111Z" fill={stroke} strokeWidth="1.5px" />
            </svg>
        );
    }
}