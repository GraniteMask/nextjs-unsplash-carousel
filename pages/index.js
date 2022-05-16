import { Avatar, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import axios from 'axios';
import DownloadIcon from '@mui/icons-material/Download';
import ShuffleRoundedIcon from '@mui/icons-material/ShuffleRounded';

export default function Home({imageInfo}) {

  const slideWidth = 30;
  const [itemList, setItemList] = useState([])

  useEffect(()=>{
    setItemList(imageInfo)
  },[])

  console.log(itemList)
  

//   console.log(_items)
  const length = 5;
//   _items.push(..._items);

  const sleep = (ms = 0) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const createItem = (position, idx) => {
      const item = {
          styles: {
              transform: `translateX(${position * slideWidth}rem)`,
          },
          player: itemList.length != 0 && itemList[idx].player,
      };

      switch (position) {
          case length - 1:
          case length + 1:
              item.styles = {...item.styles, filter: 'grayscale(1)'};
              break;
          case length:
              break;
          default:
              item.styles = {...item.styles, opacity: 0};
              break;
      }

      return item;
  };

  const download = (l) =>{
    axios({
        url: l,
        method: 'GET',
        responseType: 'blob', // important
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'file.pdf');
        document.body.appendChild(link);
        link.click();
      });
  }

  const CarouselSlideItem = ({pos, idx, activeIdx}) => {
      const item = createItem(pos, idx, activeIdx);

      return (
          <li className="carousel__slide-item" style={item.styles}>
              <a href={item.player.download} target="_blank">
                  <div className="carousel__slide-item-img-link">
                    <img src={item.player.image} />
                  </div>
              </a>
              
              <div className="carousel-slide-item__body">
                  {/* <h4>{item.player.title}</h4>
                  <p>{item.player.desc}</p> */}
                  <a href={item.player.userProfileLink} target="_blank"><Avatar alt={item.player.name} src={item.player.profile_image} /></a>
                  <h4 style={{marginLeft: "1rem"}}>{item.player.name}</h4>
                  <h5>({item.player.like} likes)</h5>
                  <a href={item.player.download} download><IconButton style={{justifyContent: "flex-end"}} onClick={()=>download(item.player.download)}><DownloadIcon/></IconButton></a>
              </div>
              
          </li>
      );
  };

  const keys = Array.from(Array(itemList.length).keys());

  const Carousel = () => {
      const [items, setItems] = useState(keys);
      const [isTicking, setIsTicking] = useState(false);
      const [activeIdx, setActiveIdx] = useState(0);
      const bigLength = items.length;

      const prevClick = (jump = 1) => {
          if (!isTicking) {
              setIsTicking(true);
              setItems((prev) => {
                  return prev.map((_, i) => prev[(i + jump) % bigLength]);
              });
          }
      };

      const nextClick = (jump = 1) => {
          if (!isTicking) {
              setIsTicking(true);
              setItems((prev) => {
                  return prev.map(
                      (_, i) => prev[(i - jump + bigLength) % bigLength],
                  );
              });
          }
      };

      const shuffle = (jump = 1) =>{
        var num = Math.floor(Math.random() * (9 - 0 + 1) + 1)
        for(var i=0; i<num; i++){
            if (!isTicking) {
                setIsTicking(true);
                setItems((prev) => {
                    return prev.map(
                        (_, i) => prev[(i - jump + bigLength) % bigLength],
                    );
                });
            }
        }
      }
 
      useEffect(() => {
          if (isTicking) sleep(300).then(() => setIsTicking(false));
      }, [isTicking]);

      useEffect(() => {
          setActiveIdx((length - (items[0] % length)) % length) // prettier-ignore
      }, [items]);

      return (
          
          <div className="carousel__wrap">
              <div className="carousel__inner">      
                  <div className="carousel__container">
                      <ul className="carousel__slide-list">
                          {items.map((pos, i) => (
                              <CarouselSlideItem
                                  key={i}
                                  idx={i}
                                  pos={pos}
                                  activeIdx={activeIdx}
                              />
                          ))}
                      </ul>
                  </div>
                  <IconButton className="carousel__btn carousel__btn--prev" onClick={() => prevClick()}><ArrowBackIosIcon style={{marginLeft: "5px", width: "24px"}}/></IconButton>
                  <IconButton className="carousel__btn carousel__btn--shuffle" onClick={() => shuffle()}><ShuffleRoundedIcon /></IconButton>
                  <IconButton className="carousel__btn carousel__btn--next" onClick={() => nextClick()}><ArrowForwardIosIcon style={{width: "29px"}}/></IconButton>
              </div>
          </div>
      );
  };
  return (
    <Layout>
      <Carousel />
    </Layout>
  )
}

export async function getServerSideProps({params}){
    const {data} = await axios.get('https://api.unsplash.com/photos/?client_id=F7KIzaBZHTZKUFisECcdyZQLdOnnflj3cjMBd0_Wda4')
    var list = new Array()
    if(data){
        for(var i=0; i<data.length; i++){
            var player = {}
            player.image = data[i].urls.raw
            player.like = data[i].likes
            player.profile_image = data[i].user.profile_image.medium
            player.name = data[i].user.name
            player.download = data[i].links.download
            player.userProfileLink = data[i].user.links.html
            console.log(player)
            var playerLarge = {}
            playerLarge = {player: player}
            console.log(playerLarge)
            list.push(playerLarge)
        }
    }
    
    console.log(list)
    return{
        props:{
            imageInfo: list
        }
    }
}