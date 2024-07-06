import { Html } from "@react-three/drei";
import { FC } from "react";

export const Loader_model:FC<any> = ({progress}) => {
    return (
        <Html style={{width: '260px', right: '-150px', top: '100px'}}>
            <div style={{ color: 'white', fontSize: '30px', textAlign: 'center' }}>Загрузка модели...</div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'white', marginTop: '16px', borderRadius: '100px' }}>
                <div style={{ height: '100%', width: `${progress}%`, backgroundColor: '#5840EA' }}></div>
            </div>
        </Html>
    );
}