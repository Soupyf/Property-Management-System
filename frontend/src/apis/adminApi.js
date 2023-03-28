import request from '../utils/request';

export function adminGetDefaultCount() {
    return request({
        method: 'GET',
        url: '/api/room/getallroomscount'
    })
}

export function adminGetCountConditional(companyGroupID, hotelName) {
    return request({
        method: 'GET',
        url: '/api/room/gethotelroomscount',
        params: {
            companyGroupID: companyGroupID,
            hotelName: hotelName
        }
    })
}

//YUKI: first time to admin without any hotel instance information, return all rooms in our groups
export function adminGetAllDefaultRooms(pageSize, currentPage) {
    return request({
        method: 'GET',
        url: '/api/room/getallrooms',
        params: {
            pagesize: pageSize,
            currentpage: currentPage
        }
    })
}

//YUKI: select the rooms by its companyID and hotelName
export function adminGetRoomsByCondition(pageSize, currentPage, companyGroupID, hotelName) {
    return request({
        method: 'GET',
        url: '/api/room/gethotelrooms',
        params: {
            pagesize: pageSize,
            currentpage: currentPage,
            companyGroupID: companyGroupID,
            hotelName: hotelName
        }
    })
}

//int-id
export function adminDeleteRoom(id) {
    return request({
        method: 'DELETE',
        url: '/api/room/deleteguestroom',
        params: {
            ID: id
        }
    })
}

//int-id,
export function adminModifyRoom(id, roomStatus, roomType, price, title, area, bedCount, windowCount, mineralWaterCount) {
    return request({
        method: 'PUT',
        url: '/api/room/modifyguestroom',
        data: {
            id: id,
            roomStatus: roomStatus,
            guestRoomType: roomType,
            price: price,
            title: title,
            area: area,
            bedCount: bedCount,
            windowCount: windowCount,
            mineralWaterCount: mineralWaterCount
        }
    })
}

export function adminAddRoom(GuestRoomType, Floor, Address, RoomStatus, RoomType, HotelInstanceID, Price, Title, Ichnography, Area, BedCount, WindowCount, MineralWaterCount, CandomCount) {
    return request({
        method: 'POST',
        url: '/api/room/addguestroom',
        data: {
            GuestRoomType: GuestRoomType,
            Floor: Floor,
            Address: Address,
            RoomStatus: RoomStatus,
            RoomType: RoomType,
            HotelInstanceID: HotelInstanceID,
            Price: Price,
            Title: Title,
            Ichnography: Ichnography,
            Area: Area,
            BedCount: BedCount,
            WindowCount: WindowCount,
            MineralWaterCount: MineralWaterCount,
            CandomCount: CandomCount
        }
    })
}

//YUKI:add factors
export function adminPriceStatusSelect(companyGroupID, hotelName, Price, PageSize, currentPage, roomStatus) {
    return request({
        method: 'GET',
        url: '/api/room/gethotelguestroomsconditionaladmin',
        params: {
            companyGroupID: companyGroupID,
            hotelName: hotelName,
            Price: Price,
            PageSize: PageSize,
            currentPage: currentPage,
            roomStatus: roomStatus
        }
    })
}

export function adminPriceStatusSelectCount(companyGroupID, hotelName, Price, roomStatus) {
    return request({
        method: 'GET',
        url: '/api/room/gethotelguestroomsconditionaladmincount',
        params: {
            companyGroupID: companyGroupID,
            hotelName: hotelName,
            Price: Price,
            roomStatus: roomStatus
        }
    })
}

////////////积分兑换功能
export function getAllAwardsCount() {
    return request({
        method: 'GET',
        url: '/api/award/getallawardscount',
    })
}
export function getAllAwards(pageSize, currentPage) {
    return request({
        method: 'GET',
        url: '/api/award/getallawards',
        params: {
            pageSize: pageSize,
            currentPage: currentPage
        }
    })
}


//YUKI:图表分析
//YUKI：graph
export function getWeekOrderSumByNow() {
    return request({
        method: 'GET',
        url: '/api/order/getweekordersumbynow',
        params: {

        }
    })
}

export function getWeekOrderCountByNow() {
    return request({
        method: 'GET',
        url: '/api/order/getweekordercountbynow',
        params: {

        }
    })
}

export function getWeekOrderSumByRoomNow() {
    return request({
        method: 'GET',
        url: '/api/order/getweekordersumbyroomnow',
        params: {

        }
    })
}

export function getWeekOrderCountByRoomNow() {
    return request({
        method: 'GET',
        url: '/api/order/getweekordercountbyroomnow',
        params: {

        }
    })
}

//YUKI:员工管理
//根据指定id来删除employee,删除行
export function deleteEmployee(id) {
    return request({
        method: 'DELETE',
        url: '/api/employeeinstance/deleteemployee',
        params: {
            id: id
        }
    })
}

//更改指定证件号的数据
export function modifyEmployee(ID, EmployeeName, IdentityCardType, IdentityCardId, Character, PhoneNumber) {
    return request({
        method: 'PUT',
        url: '/api/employeeinstance/modifyemployee',
        data: {
            ID: ID,//int
            EmployeeName: EmployeeName,
            IdentityCardType: IdentityCardType,//int
            IdentityCardId: IdentityCardId,
            Character: Character,
            PhoneNumber: PhoneNumber
        }
    })
}


//添加员工，如果证件号存在，返回777；如果证件号不合法，返回888，999，其他情况返回正确数据
export function addEmployee(EmployeeName, IdentityCardType, IdentityCardId, Character, PhoneNumber) {
    return request({
        method: 'POST',
        url: '/api/employeeinstance/addemployeeinstance',
        data: {
            EmployeeName: EmployeeName,
            IdentityCardType: IdentityCardType,//int
            IdentityCardId: IdentityCardId,
            Character: Character,
            PhoneNumber: PhoneNumber
        }
    })
}

//返回所有employees
export function getAllEmployee(pageSize, currentPage) {
    return request({
        method: 'GET',
        url: '/api/employeeinstance/getallemployees',
        params: {
            pageSize: pageSize,
            currentPage: currentPage
        }
    })
}

//返回所有employees
export function getAllEmployeeCount() {
    return request({
        method: 'GET',
        url: '/api/employeeinstance/getemployeescount',
        params: {
        }
    })
}