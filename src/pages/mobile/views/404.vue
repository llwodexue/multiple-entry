<template>
  <div class="http-404">
    <navbar class="fixed-header" />

    <div class="wscn-http404-container">
      <div class="wscn-http404">
        <div class="pic-404">
          <img class="pic-404__parent" src="@/assets/404_images/404.png" alt="404">
        </div>
        <div class="bullshit">
          <div class="bullshit__oops">抱歉，找不到此页面</div>
          <div class="bullshit__info">您所寻找的页面不存在。您可以点击下面的按钮返回首页。</div>
          <a :href="homeUrl" class="bullshit__return-home">返回首页</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@mobile/mobile-layout/components/Header.vue'

export default {
  name: 'Page404',
  components: { navbar: Header },
  computed: {
    homeUrl() {
      return location.origin + '/mobile'
    }
  }
}
</script>

<style lang="scss" scoped>
.fixed-header {
  z-index: 1;
}
.wscn-http404-container {
  transform: translate(-50%, -50%);
  position: absolute;
  top: 40%;
  left: 50%;
}
.wscn-http404 {
  position: relative;
  top: 30px;
  width: 100%;
  padding: 0 50px;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .pic-404 {
    width: 300px;
    overflow: hidden;
    &__parent {
      width: 100%;
    }
  }
  .bullshit {
    width: 300px;
    padding: 30px 0;
    overflow: hidden;
    &__oops {
      font-size: 32px;
      font-weight: bold;
      line-height: 40px;
      color: #1482f0;
      opacity: 0;
      margin-bottom: 20px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
    }
    &__info {
      font-size: 13px;
      line-height: 21px;
      color: grey;
      opacity: 0;
      margin-bottom: 30px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.2s;
      animation-fill-mode: forwards;
    }
    &__return-home {
      display: block;
      float: left;
      width: 110px;
      height: 36px;
      background: #1482f0;
      border-radius: 100px;
      text-align: center;
      color: #ffffff;
      opacity: 0;
      font-size: 14px;
      line-height: 36px;
      cursor: pointer;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.3s;
      animation-fill-mode: forwards;
    }
    @keyframes slideUp {
      0% {
        transform: translateY(60px);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }
}
</style>
