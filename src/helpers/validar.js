'use strict'

exports.validarId = (id) => {
    let expRegular = /^([0-9])*$/;
    if(expRegular.test(id)){
        return true;
    } else {
        return false;
    }
}