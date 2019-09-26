<template>
    <div class="ui-editer-wrap">
        <div class="ui-editer-header"></div>
        <div class="ui-editer-content">
            <div class="ui-editer-content-in">
                <div class="ui-editer-left-menu">
                    <div class="ui-menu-list">
                        <div class="item active">
                            <div class="item-icon">
                                <ui-icon :icon="'#iconshipin'"></ui-icon>
                            </div>
                            <div class="name">视频</div>
                        </div>
                        <div class="item">
                            <div class="item-icon">
                                <ui-icon :icon="'#icontupian'"></ui-icon>
                            </div>
                            <div class="name">图片</div>
                        </div>
                        <div class="item">
                            <div class="item-icon">
                                <ui-icon :icon="'#icontupian'"></ui-icon>
                            </div>
                            <div class="name">混播</div>
                        </div>
                        <div class="item">
                            <div class="item-icon">
                                <ui-icon :icon="'#iconzimu-b'"></ui-icon>
                            </div>
                            <div class="name">字幕</div>
                        </div>
                        <div class="item">
                            <div class="item-icon">
                                <ui-icon :icon="'#iconshizhong'"></ui-icon>
                            </div>
                            <div class="name">时钟</div>
                        </div>
                    </div>
                </div>
                <div class="ui-editer-left-info">

                </div>
                <div class="ui-editer-main" ref="editer">
                    <div class="ui-editer-canvas" id="list">
 
                        <drag-view :id="1">fdsaf</drag-view>
                        <!--<drag-view :id="2">fdsafffff</drag-view> -->
                        <!-- <demo-view v-for="(rect, index) in rects"
                           :key="index"
                           :w="rect.width"
                           :h="rect.height"
                           :x="rect.left"
                           :y="rect.top"
                           :parentW="listWidth"
                           :parentH="listHeight"
                           :axis="rect.axis"
                           :isActive="rect.active"
                           :minw="rect.minw"
                           :minh="rect.minh"
                           :isDraggable="rect.draggable"
                           :isResizable="rect.resizable"
                           :parentLimitation="rect.parentLim"
                           :snapToGrid="rect.snapToGrid"
                           :aspectRatio="rect.aspectRatio"
                           :z="rect.zIndex"
                           v-on:activated="activateEv(index)"
                           v-on:deactivated="deactivateEv(index)"
                           v-on:dragging="changePosition($event, index)"
                           v-on:resizing="changeSize($event, index)"
                           style="background:red"
                        ></demo-view> -->
                    </div>
                </div>
                <div class="ui-editer-right-info">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import dragView from '@/components/drag'
import demoView from '@/components/demoDrag'
export default {
    data() {
        return {
            test: 1,
            active: false,
            top: 0,
            left: 0,
            width: 100,
            height: 100,
            listWidth: 0,
            listHeight: 0
        }
    },
    methods: {
        activateEv(index) {
            this.$store.dispatch('rect/setActive', {id: index});
        },
        deactivateEv(index) {
            this.$store.dispatch('rect/unsetActive', {id: index});
        },
        changePosition(newRect, index) {

            this.$store.dispatch('rect/setTop', {id: index, top: newRect.top});
            this.$store.dispatch('rect/setLeft', {id: index, left: newRect.left});
            this.$store.dispatch('rect/setWidth', {id: index, width: newRect.width});
            this.$store.dispatch('rect/setHeight', {id: index, height: newRect.height});
        },
        changeSize(newRect, index) {
            this.$store.dispatch('rect/setTop', {id: index, top: newRect.top});
            this.$store.dispatch('rect/setLeft', {id: index, left: newRect.left});
            this.$store.dispatch('rect/setWidth', {id: index, width: newRect.width});
            this.$store.dispatch('rect/setHeight', {id: index, height: newRect.height});
        }
    },
    created() {
        // console.log(this.lastChild)
    },
    mounted() {
        let listEl = document.getElementById('list');
        this.listWidth = listEl.clientWidth;
        this.listHeight = listEl.clientHeight;

        window.addEventListener('resize', ()=>{
            this.listWidth = listEl.clientWidth;
            this.listHeight = listEl.clientHeight;
        })
    },
    components:{
        dragView,
        demoView
    },
    computed: {
        rects() {
            console.log(this.$store.state.rect)
            return this.$store.state.rect.rects
        }
    },
}
</script>
<style lang="scss" scoped>
    .ui-editer-wrap{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color:#1d1e20;
        // 顶部菜单
        .ui-editer-header{
            width: 100%;
            height: 50px;
            background-color: #343434;
            display: flex;
            z-index: 20;
        }
        .ui-editer-content{
            position: relative;
            display:flex;
            flex: 1;
            overflow: hidden;
            width: 100%;
            height: 100%;
            .ui-editer-content-in{
                position: absolute;    
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                display: flex;
                justify-content: center;
            }
        }
        // 左侧区域按钮
        .ui-editer-left-menu{
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex-shrink: 0;
            width: 50px;
            height: 100%;
            z-index: 19;
            background-color: #474747;
            .ui-menu-list{
                text-align: center;
                .item{
                    margin: 10px 0px;
                    color: #d8d8d8;
                    &:hover{
                        color:#ffffff;
                        cursor:pointer;
                    }
                    &.active{
                        background-color: #323232;
                    }
                    .item-icon{
                        font-size: 24px;
                    }
                    .name{
                        padding: 5px 0px;
                        font-size: 12px;
                    }
                }
            }
        }
        // 左侧信息栏
        .ui-editer-left-info{
            display: flex;
            flex-direction: column;
            width: 300px;
            height: 100%;
            z-index: 19;
            background-color: #323232;
        }
        // 右侧信息栏
        .ui-editer-right-info{
            display: flex;
            width: 300px;
            height: 100%;
            z-index: 19;
            background-color: #323232;
        }
        .ui-editer-main{
            position: relative;
            flex: 1;
            display: flex;
            flex-direction: column;
        }
        // 画布编辑区
        .ui-editer-canvas{
            position:absolute;
            top: 50%;
            left: 50%;
            width: 500px;
            height: 500px;
            background-color: #000000;
            transform: translate(-50%,-50%);
        }
    }
</style>