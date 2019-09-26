// 引入
import regeneratorRuntime from '../../lib/runtime/runtime.js';
import {request, getSetting, openSetting, chooseAddress} from '../../request/index.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 购物车数据
    shoppingCartData: [],
    // 收货地址信息
    address: {},
    // 全选是否选中
    isAllChecked: false,
    // 总价
    totalPrice: 0,
    // 总数
    totalNum: 0
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    // 本地数据
    let shoppingCartData = wx.getStorageSync('shoppingCartData') || [];
    let address = wx.getStorageSync('cartAddress')
    // 设置
    this.setData({
      shoppingCartData, address
    })

    // 调用计算总价及数量的方法,传入数据
    this.getTotalPriceAndNum(shoppingCartData)
  },
  /* 收货地址 */
  async handleGetAddress(){
    try{
      // 点击获得用户当前设置
      const res1 = await getSetting()
      // 获得设置的状态
      let auth = res1.authSetting['scope.address']
      // 判断状态，若是 false, 打开设置
      if(auth === false){
        await openSetting()
      }
      // 收获地址信息
      const res2 = await chooseAddress()
      // 设置 详细收货地址
      res2.detailAddress = res2.provinceName + res2.cityName + res2.countyName + res2.detailInfo
      // 赋值
      this.setData({
        address: res2
      })
      // 存入本地
      wx.setStorageSync("cartAddress", res2);
    }
    catch(error){
      return
    }
  },
  /* 计算总价及总数 */
  getTotalPriceAndNum(cartData){
    // 默认全选选中状态, 若一个未选中则全选不勾选
    let isAllChecked = true
    // 总价, 复选框选中状态的价格相加
    let totalPrice = 0
    // 总数, 复选框选中状态的数量相加
    let totalNum = 0

    // 遍历数据
    cartData.forEach(v => {
      // 是否选中
      if(v.checked){
        totalPrice += v.buy_num * v.goods_price
        totalNum += v.buy_num
      }else{
        isAllChecked = false
      }
    })

    // 赋值
    this.setData({
      totalPrice,
      totalNum,
      isAllChecked
    })
  }
})