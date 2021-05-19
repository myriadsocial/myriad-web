import React from 'react';

import { useStyles } from './profile.style';

export default function Header() {
  const style = useStyles();

  return (
    <div className="header" style={{ marginBottom: 10 }}>
      <div className={style.headerPicture}>
        <div className="leftSide" style={{ display: 'flex', alignItems: 'center' }}>
          <div className={style.avatar}>
            <span>😘</span>
          </div>
          <div className="Keterangan">
            <p className="username">Firstname LastName</p>
            <p className="publicKey">Public Key</p>
          </div>
        </div>
        <div className="rightSide" style={{ display: 'flex', flexDirection: 'column' }}>
          <button>Send Tip</button>
          <button>Add Friends</button>
        </div>
      </div>

      <div className={style.about}>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reiciendis rerum laudantium aut fugit distinctio! Voluptatem, aliquam
          assumenda sequi maiores commodi veritatis reprehenderit itaque tenetur recusandae repellat repellendus autem debitis illo.
        </p>
      </div>

      <div className={style.socialMediaList}>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: 10 }}>
          <div className={style.logo}></div>
          <a href="#" target="_blank">
            Link 1
          </a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: 10 }}>
          <div className={style.logo}></div>
          <a href="#" target="_blank">
            Link 2
          </a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: 10 }}>
          <div className={style.logo}></div>
          <a href="#" target="_blank">
            Link 3
          </a>
        </div>
      </div>
    </div>
  );
}
