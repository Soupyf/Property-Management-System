//PUT请求：如果两个请求相同，后一个请求会把第一个请求覆盖掉。（所以PUT用来改资源）
//POST请求：后一个请求不会把第一个请求覆盖掉。（所以Post用来增加源）
import request from '../utils/request';

export function administratorLogin(id, password) {
    return request({
        method: 'GET',
        url: '/api/administration/getadministration',
        params: {
            account: id,
            password: password
        }
    })
}
export function userSignIn(id, password) {
    return request({
        method: 'GET',
        url: '/api/user/getuser',
        params: {
            account: id,
            password: password
        }
    })
}

export function userSignUp(nickName, account, password, phoneNumber) {
    return request({
        method: 'POST',
        url: '/api/user/adduser',
        data: {
            nickName: nickName,
            account: account,
            password: password,
            phoneNumber: phoneNumber
        }
    })
}

export function forgetPassword(account, password, phoneNumber) {
    return request({
        method: 'PUT',
        url: '/api/user/modifyuser',
        data: {
            account: account,
            password: password,
            phoneNumber: phoneNumber
        }
    })
}

export function deleteUser(account, password, phoneNumber) {
    return request({
        method: 'DELETE',
        url: '/api/user/deleteuser',
        params: {
            account: account,
            password: password,
            phoneNumber: phoneNumber
        }
    })
}

export function sendEmail(email) {
    return request({
        method: 'POST',
        url: '/api/user/sendmail',
        data: {
            email: email,
            code: "0"
        }
    })
}