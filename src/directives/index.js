/**
 * @description fitIphoneX 主要是为了适配iphoneX自适配的问题,可以设置padding,maring,bottom
 * @params setValue 需要设置的值  | type 设置的类型，比如说padding
 * @useage  v-fitIphoneX="{ type: 'padding', pxNum: 10 }"
 */
function judgeIPhoneX() {
    // 判断是否是iphoneX
    let ua = window.navigator.userAgent
    let isIos = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    return isIos && window.screen.height === 812 && window.screen.width === 375
        ? true
        : false
}

export const fitIphoneX = {
    bind(el, binding) {
        let isIPhoneX = judgeIPhoneX()
        let designWidth = 375 // 设计稿高度
        let pxNum = binding.value.pxNum
        let iphoneXNum = (binding.value.pxNum || 30) + 34
        let setValue = isIPhoneX
            ? (100 / designWidth) * iphoneXNum
            : (100 / designWidth) * pxNum // 转化成vw
        switch (binding.value.type) {
            case 'padding':
                el.style.paddingBottom = `${setValue}vw`
                break
            case 'margin':
                el.style.marginBottom = `${setValue}vw`
                break
            default:
                el.style.bottom = `${setValue}vw`
                break
        }
    },
}

/**
 * @description 修复ios手机失去焦点页面未还原问题
 * @params
 * @useage v-reset-page
 */
export const resetPage = {
    inserted() {
        // 监听键盘收起事件
        document.body.addEventListener('focusout', () => {
            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                // 软键盘收起处理
                setTimeout(() => {
                    const scrollHeight =
                        document.documentElement.scrollTop ||
                        document.body.scrollTop ||
                        0
                    window.scrollTo({
                        left: 0,
                        top: Math.max(scrollHeight - 1, 0),
                        behavior: 'smooth',
                    })
                }, 100)
            }
        })
    },
}

/**
 * @description input输入框只能输入数字
 * @params
 * @useage v-number-only
 */
export const numberOnly = {
    bind(el, binding) {
        el.handler = function() {
            let val = el.value
            val = val.replace(/[^\d]/g, '')
            if (el.value.length > binding.value) {
                el.value = val.slice(0, binding.value)
                console.log('el.value---', el.value)
            }
        }
        el.addEventListener('input', el.handler, false)
    },
    unbind(el) {
        el.removeEventListener('input', el.handler)
    },
}
