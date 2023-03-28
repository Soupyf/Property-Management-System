<template>
  <div>
    <div id="map"></div>
  </div>
</template>


<script>
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import Select from 'ol/interaction/Select';
import { getCenter } from 'ol/extent';
import ImageLayer from 'ol/layer/Image';
import Projection from 'ol/proj/Projection';
import Static from 'ol/source/ImageStatic';
import GeoJSON from 'ol/format/GeoJSON';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import {
  Fill, Stroke, Style, Text,
} from 'ol/style';
const extent = [0, 0, 50, 50];
const projection = new Projection({
  code: 'xkcd-image',
  units: 'pixels',
  extent,
});
export default {
  data() {
    return {
      map: {},
      features1:[],
      features2: [{
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[[15, 20], [20, 20], [20, 6.8], [15, 6.8]]],
          },
          id: '22',
          properties: {roomMsg:'"超超超豪华的总统套房"',modelId: '22', id: '22', type: 'room', price: 777 }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[[22, 21], [28, 21], [28, 5], [22, 5]]],
          },
          id: '23',
          properties: {roomMsg:'"小有氛围感的双人间"',modelId: '23', id: '23', type: 'room',  price: 222},
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[[30, 21], [35, 21], [35, 6], [30, 6]]],
          },
          id: '27',
          properties: {roomMsg:'"麻雀虽小五脏俱全的可爱小房间"',modelId: '27', id: '27', type: 'room', price:100 }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[[16, 40], [35, 40], [35, 30], [16, 30]]],
          },
          id: '28',
          properties: {roomMsg:'"豪华双人间！"',modelId: '28', id: '28', type: 'room', price:334}
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[[5, 40], [13, 40], [13, 30], [5, 30]]],
          },
          id: '29',
          properties: {roomMsg:'"一家住的家庭房"',modelId: '29', id: '29', type: 'room', price:255}
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[[37, 40], [45, 40], [45, 30], [37, 30]]],
          },
          id: '30',
          properties: {roomMsg:'"性价比超高的单人间"',modelId: '30', id: '30', type: 'room', price:88}
        }
        
        ],
        features3:[{
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[[15, 20], [20, 20], [20, 6.8], [15, 6.8]]],
          },
          id: '1',
          properties: {roomMsg:'"至尊享受豪华房"',modelId: '1', id: '1', type: 'room', price: 555 }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[[22, 21], [28, 21], [28, 5], [22, 5]]],
          },
          id: '2',
          properties: {roomMsg:'"热带雨林风情双人间"',modelId: '2', id: '2', type: 'room', price:222 }
        },{
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[[30, 21], [35, 21], [35, 6], [30, 6]]],
          },
          id: '3',
          properties: {roomMsg:'"普普通通单人间"',modelId: '3', id: '3', type: 'room', price:100 }
        }],
        features4:[],
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      // console.log(this.$route.params.hotelId)
      const getStyles = (param) => {
        console.log(param);
        const style = new Style({
          stroke: new Stroke({
            color: '#2F4F4F',
            width: 2.9,
          }),
          fill: new Fill({
            color: '#48D1CC	',//delux
            opacity: 0.8,
          }),
          text: new Text({ // 文本样式
            className: 'map-font',
            font: '30px Microsoft YaHei',
            fill: new Fill({
              color: 'white',
            }),
          }),
        });

        if ( param == "2") {
          style.getFill().setColor('#00BFFF');
        }
        style.getText().setText(param);
        if (param === '3' || param == "27" || param == "30") {//single
          style.getFill().setColor('#9370DB');
        }
        if (param === '28') {//three
          style.getFill().setColor('#DA70D6');
        }
        if (param === '29' || param === '23') { //double
          style.getFill().setColor('#6495ED');
        }
        style.getText().setText(param);
        return style;
      };
      var temp = null
      if(this.$route.params.hotelId == 1) {
        temp = this.features1
      }else if(this.$route.params.hotelId == 2){
        temp = this.features2
      }else if(this.$route.params.hotelId == 3){
        temp = this.features3
      }else if(this.$route.params.hotelId == 4){
        temp = this.features4
      }
      const styleFunction = (feature) => getStyles(feature.values_.modelId);
      const geojsonObject = {
        type: 'FeatureCollection',
        crs: {
          type: 'name',
          properties: {
            name: 'EPSG:3857',
          },
        },
        
        features: temp
      };
      // console.log((new GeoJSON()).readFeatures(geojsonObject));
      const vectorSource = new VectorSource({
        features: (new GeoJSON()).readFeatures(geojsonObject),
      });
      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: styleFunction,
        title: '',
        type: 'room',
      });
      this.map = new Map({
        layers: [
          new ImageLayer({
            source: new Static({
              url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTahh_KEr7nyApxm99Aqz0HVvPknVQ6rAC9RA&usqp=CAU',
              projection,
              imageExtent: extent,
            }),
          }),
          vectorLayer,
        ],
        target: 'map',
        view: new View({
          projection,
          center: getCenter(extent),
          zoom: 0,
          maxZoom: 4,
          minZoom: 1,
          dragging: true
        }),
      });
      // 选中之后的样式
      const selectSingleClick = new Select({
        style: new Style({
          stroke: new Stroke({
            color: '#2d9fd8',
            width: 2.5,
          }),
          fill: new Fill({
            color: [0, 11, 214, 0.5],
            opacity: 2.5,
          }),
        }),
      });
      this.map.addInteraction(selectSingleClick);
      // 点击图层之后的处理
      selectSingleClick.on('select', (e) => {
        const features = e.target.getFeatures().getArray();
        if (features.length > 0) {
          const feature = features[0];
          const type = feature.getGeometry().getType();
          const property = feature.getProperties();
          const coordinate = getCenter(feature.getGeometry().getExtent());
          this.$confirm("是否要跳转到"+property.roomMsg+"的订购页面？", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({
            name: "clientRoomReserve", params: {
              roomID: parseInt(property.id),
              companyGroupId: this.$route.params.hotelId, hotelName: this.$route.params.hotelName
              , price: property.price, startTime: "", endTime: "",
              hotelAddres: this.$route.params.hotelAddress
            }
          });
        }).catch(() => {
          
        });
          // we can change this into a new page jumping
          //YUKI:to roomReserve, past roomID
         
        }
      });
    },
  },
};
</script>

<style scoped>
#map {
  width: 1050px;
  height: 750px;
}

.ol-layer .map-font {
  font-size: 17px;
  font-weight: 400;
  line-height: 20px;
}
</style>


