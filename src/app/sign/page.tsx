"use client"

import Auth from "components/auth/Auth";
import Register from "components/register/Register";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Sign = () => {
  const buttons = ["Авторизация", "Регистрация"];
  const [active, setActive] = useState<string>('Авторизация')

  const handleSetActive = (name:string) => {
    setActive(name)
  }

  return (
    <div className="wrapper-auth">
      <div className="auth">
        <div className="inner-block__auth">
          <div className="header_auth">
            <Link href="/" className="logo">
              <svg width="40" height="44" viewBox="0 0 40 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M28.1858 9.4104C31.4721 9.4104 32.2305 2.62813 32.4833 0H9.22626C5.68714 0 0.976561 4.3549 0.125691 9.4104C-0.588389 13.6532 1.89521 18.3121 3.6648 19.8382C5.43439 21.3642 6.69832 22.3815 9.22626 22.3815C11.7542 22.3815 25.4051 22.3815 26.9218 22.8902C28.4386 23.3988 27.6802 26.1965 26.9218 26.4509C26.1634 26.7052 20.7291 26.4509 20.7291 26.4509L21.1076 24.6705H11.5014L6.44553 44H16.3045L18.5796 35.8613C20.602 35.946 25.6578 36.0647 29.7025 35.8613C34.7584 35.6069 37.5392 33.3179 38.8031 30.2659C40.0671 27.2139 40.6998 23.3988 38.8031 18.8208C36.9065 14.2428 34.1271 13.9884 31.4721 13.4798C28.8171 12.9711 12.7654 13.4798 12.7654 12.7168C12.7654 11.9538 13.271 9.4104 13.7766 9.4104H28.1858Z" fill="white"/>
              </svg>
            </Link>
            <div className="btns-header__auth">
              {buttons.map((name) => {
                return (
                  <button
                    key={name}
                    className={active === name ? 'btn-header__auth active' : 'btn-header__auth'}
                    onClick={() => handleSetActive(name)}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="forms">
            <div className={active === 'Регистрация' ? "forms__inner active" : "forms__inner"}>
              <Auth />
              <Register setActive={setActive}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sign;
