import react, { CSSProperties, useState } from 'react';
import Echantillon from './Echantillon';
import { EchantillonType } from '../types/states';
import { Button, Modal } from '@mui/material';
import { backend_url } from '../network';
import HashLoader from 'react-spinners/HashLoader';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { BiError } from 'react-icons/bi';

const style: CSSProperties = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: 'white',
  border: '2px solid #000',
  boxShadow: '0 0 14px 3px rgba(0,0,0,0.3)',
  padding: 15,
};

const EchantillonsConteneur = () => {
  const [echantillons, setEchantillons] = useState<EchantillonType[]>([]);
  const [seuil, setSeuil] = useState<number>(0.05);
  const [result, setResult] = useState({
    isOpen: false,
    kt: 0,
    ko: 0,
    msg: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const notify = (message: string, dataToast: any, type: number) => {
    if (type < 0) {
      toast.error(message, dataToast);
    } else {
      toast(message, dataToast);
    }
  };
  return (
    <div className="echantillon-container">
      {isLoading && (
        <div className="Loader">
          <HashLoader color="#4236d6" size={80} />
        </div>
      )}
      <div className="seuil-div">
        <label>seuil de signification</label>
        <select
          defaultValue={0.05}
          onChange={e => {
            setSeuil(parseFloat(e.target.value));
          }}
        >
          <option value={0.025}>2.5%</option>
          <option value={0.05}>5%</option>
        </select>
      </div>
      <h3>Echantillons</h3>
      <p>Entrez ci dessous les differents echantillons</p>

      {echantillons.map((el, i) => {
        return (
          <Echantillon
            last={i === echantillons.length - 1}
            key={i}
            index={i}
            toDelete={(index: number) => {
              console.clear();
              console.log(`index i : ${i}`);

              setEchantillons(prev => {
                console.log(`index index : ${index}`);
                let tmp = [...prev];
                console.log('el.index', tmp[index].index);
                let Tmp = tmp.filter(el => el.index !== index);
                console.log('Tmp', Tmp);
                return [...Tmp];
              });
            }}
            Data={echantillons[i]}
            onChange={(echantillon: EchantillonType) => {
              setEchantillons(prev => {
                prev[i] = echantillon;
                return prev;
              });
            }}
          />
        );
      })}
      <button
        onClick={() => {
          setEchantillons(prev => {
            let tmp = [...prev];
            tmp.push({
              elements: [],
              taille: 0,
              index: prev.length,
            });
            return [...tmp];
          });
        }}
      >
        Ajouter un Echantillon
      </button>
      <button
        className={echantillons.length > 1 ? 'submit' : 'disabled-submit'}
        onClick={() => {
          if (echantillons.length > 1) {
            setIsLoading(true);
            console.log('echantillons', echantillons);
            axios
              .post<{
                data: { kt: number; ko: number; msg: string };
                msg: string;
              }>(backend_url + '/test', {
                echantillons: echantillons,
                seuil: seuil,
              })
              .then(res => {
                setResult({
                  isOpen: true,
                  kt: res.data.data.kt,
                  ko: res.data.data.ko,
                  msg: res.data.data.msg,
                });
                console.log('res.data', res.data);
              })
              .catch(err => {
                console.log('err', err)
                notify(
                  err.response.data.data.msg,
                  {
                    duration: 4000,
                    position: 'top-center',
                    style : {
                      fontSize : 12
                    },
                    // Custom Icon
                    icon: <BiError color="red" size={30} />,
                    iconTheme: {
                      primary: '#000',
                      secondary: '#fff',
                    },
                  },
                  -1
                );
                console.log('err', err);
              })
              .finally(() => {
                setIsLoading(false);
              });
          } else {
            notify(
              'Vous devez entrer au moins deux echantillons',
              {
                duration: 4000,
                position: 'top-center',

                // Custom Icon
                icon: <BiError color="red" size={30} />,
                iconTheme: {
                  primary: '#000',
                  secondary: '#fff',
                },
              },
              -1
            );
          }
        }}
      >
        Tester
      </button>
      <Toaster />
      <Modal
        open={result.isOpen}
        onClose={() => {
          setResult({ ...result, isOpen: false });
        }}
        // aria-labelledby="modal-modal-title"
        // aria-describedby="modal-modal-description"
      >
        <div style={style}>
          <h2>Résultats du test</h2>
          <h3>Loi de probabilité</h3>
          <p>
            {echantillons.length === 2
              ? "Comme il s'agit d'un test paramétrique sur la comparaison de deux variances, on utilise le test de Fisher"
              : "Comme il s'agit d'un test paramétrique sur la comparaison de plus de deux variances, on utilise le test de Bartlet"}
          </p>
          <h3>Valeur du test</h3>
          <p>
            La Valeur observée est : <code>{result.ko}</code>
          </p>
          <h3>Point critique et zone de non rejet</h3>
          <p>
            <code>
              seuil = <em>{seuil}</em>
            </code>
            donc{' '}
            <code>
              seuil/2 = <em>{seuil / 2}</em>
            </code>{' '}
            . La valeur critique est : {result.kt}
          </p>
          <h3>Conclusion et Prise de decision</h3>
          <p>{result.msg}</p>
        </div>
      </Modal>
    </div>
  );
};

export default EchantillonsConteneur;
