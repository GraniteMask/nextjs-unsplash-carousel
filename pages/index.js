import { IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import axios from 'axios';

export default function Home({imageInfo}) {

  const slideWidth = 30;
  const [itemList, setItemList] = useState([])

  useEffect(()=>{
    console.log(imageInfo)
    for(var i=0; i<imageInfo.length; i++){
        var player = {}
        player.image = imageInfo[i].urls.raw
        var playerLarge = {}
        playerLarge = {player: player}
        console.log(playerLarge)
    }
  },[])
  const _items = [
      {
          player: {
              title: 'Efren Reyes',
              desc: 'Known as "The Magician", Efren Reyes is well regarded by many professionals as the greatest all around player of all time.',
              image: 'https://i.postimg.cc/RhYnBf5m/er-slider.jpg',
          },
      },
      {
          player: {
              title: "Ronnie O'Sullivan",
              desc: "Ronald Antonio O'Sullivan is a six-time world champion and is the most successful player in the history of snooker.",
              image: 'https://i.postimg.cc/qBGQNc37/ro-slider.jpg',
          },
      },
      {
          player: {
              title: 'Shane Van Boening',
              desc: 'The "South Dakota Kid" is hearing-impaired and uses a hearing aid, but it has not limited his ability.',
              image: 'https://i.postimg.cc/cHdMJQKG/svb-slider.jpg',
          },
      },
      {
          player: {
              title: 'Mike Sigel',
              desc: 'Mike Sigel or "Captain Hook" as many like to call him is an American professional pool player with over 108 tournament wins.',
              image: 'https://i.postimg.cc/C12h7nZn/ms-1.jpg',
          },
      },
      {
          player: {
              title: 'Willie Mosconi',
              desc: 'Nicknamed "Mr. Pocket Billiards," Willie Mosconi was among the first Billiard Congress of America Hall of Fame inductees.',
              image: 'https://i.postimg.cc/NfzMDVHP/willie-mosconi-slider.jpg',
          },
      },
  ];

  const length = _items.length;
  _items.push(..._items);

  const sleep = (ms = 0) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const createItem = (position, idx) => {
      const item = {
          styles: {
              transform: `translateX(${position * slideWidth}rem)`,
          },
          player: _items[idx].player,
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

  const CarouselSlideItem = ({pos, idx, activeIdx}) => {
      const item = createItem(pos, idx, activeIdx);

      return (
          <li className="carousel__slide-item" style={item.styles}>
              <div className="carousel__slide-item-img-link">
                  <img src={item.player.image} alt={item.player.title} />
              </div>
              <div className="carousel-slide-item__body">
                  <h4>{item.player.title}</h4>
                  <p>{item.player.desc}</p>
              </div>
          </li>
      );
  };

  const keys = Array.from(Array(_items.length).keys());

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

      useEffect(() => {
          if (isTicking) sleep(300).then(() => setIsTicking(false));
      }, [isTicking]);

      useEffect(() => {
          setActiveIdx((length - (items[0] % length)) % length) // prettier-ignore
      }, [items]);

      return (
          
          <div className="carousel__wrap">
              <div className="carousel__inner">
                  
                  <IconButton className="carousel__btn carousel__btn--prev" onClick={() => prevClick()}><ArrowBackIosIcon/></IconButton>
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
                  <IconButton className="carousel__btn carousel__btn--next" onClick={() => nextClick()}><ArrowForwardIosIcon/></IconButton>
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
    return{
        props:{
            imageInfo: data
        }
    }
}