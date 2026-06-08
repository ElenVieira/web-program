'use client';

import Botoes from './components/botoes';
import Display from './components/display';
import useCalculator from './hooks/useCalculator';
import styles from './styles/Calculadora.module.css';

const TECLAS = [
    [
        { valor: 'AC', operator: true },
        { valor: '+/-', operator: true },
        { valor: '%', operator: true },
        { valor: '/', operator: true },
    ],
    [
        { valor: 7 },
        { valor: 8 },
        { valor: 9 },
        { valor: '*', operator: true },
    ],
    [
        { valor: 4 },
        { valor: 5 },
        { valor: 6 },
        { valor: '-', operator: true },
    ],
    [
        { valor: 1 },
        { valor: 2 },
        { valor: 3 },
        { valor: '+', operator: true },
    ],
    [
        { valor: 0 },
        { valor: '.' },
        { valor: '=', operator: true },
    ],
];

export default function Home() {
    const { displayValue, handleButtonClick } = useCalculator();

    return (
        <main className={styles.pagina}>
            <div className={styles.calculadora}>
                <Display valor={displayValue} />
                <div className={styles.teclado}>
                    {TECLAS.flat().map((tecla) => (
                        <Botoes
                            key={String(tecla.valor)}
                            valor={tecla.valor}
                            operator={tecla.operator}
                            onClick={() => handleButtonClick(tecla.valor)}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}
