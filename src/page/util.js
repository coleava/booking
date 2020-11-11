import _ from 'lodash'

export const users = _.map(new Array(100) ,(item,index)=>  {
    let user = {
        key: index,
        id:`user-${index}`,
        name: `Disabled User-${index + 1}`,
        mobile: '15160945242',
        email: 'aa@lib.com',
        address: 'Sidney No. 78 Lake Park',
    }
    return user;
});