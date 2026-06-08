import { useState, useCallback } from "react";

// ── Configurações do jogo ─────────────────────────────────────────────────────
const HERO_INITIAL = {
    name: "Herói",
    life: 100,
    maxLife: 100,
    attack: 20,
    defense: 0,
    potions: 3,
    isDefending: false,
};

const VILLAIN_INITIAL = {
    name: "Vilão",
    life: 120,
    maxLife: 120,
    attack: 18,
    defense: 0,
    isDefending: false,
};

const POTION_HEAL = 30;
const DEFENSE_REDUCTION = 0.5; // 50% de redução de dano ao defender
const FLEE_CHANCE = 0.4;       // 40% de chance de fugir

// ── Utilitários ───────────────────────────────────────────────────────────────
function clamp(value, min = 0, max = 100) {
    return Math.min(max, Math.max(min, value));
}

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calcDamage(attacker) {
    // Dano com variação de ±20%
    const base = attacker.attack;
    const variation = randomBetween(-Math.floor(base * 0.2), Math.floor(base * 0.2));
    return Math.max(1, base + variation);
}

function applyDamage(target, rawDamage) {
    const finalDamage = target.isDefending
        ? Math.floor(rawDamage * (1 - DEFENSE_REDUCTION))
        : rawDamage;
    const newLife = clamp(target.life - finalDamage, 0, target.maxLife);
    return { updatedTarget: { ...target, life: newLife, isDefending: false }, finalDamage };
}

// ── Hook principal ────────────────────────────────────────────────────────────
export default function useGameManager() {
    const [hero, setHero] = useState({ ...HERO_INITIAL });
    const [villain, setVillain] = useState({ ...VILLAIN_INITIAL });
    const [isHeroTurn, setIsHeroTurn] = useState(true);
    const [log, setLog] = useState(["⚔️ O combate começou! É a vez do Herói."]);
    const [gameOver, setGameOver] = useState(null); // null | "hero_win" | "villain_win" | "fled"

    const addLog = useCallback((message) => {
        setLog((prev) => [...prev, message]);
    }, []);

    // ── Turno do vilão (automático) ───────────────────────────────────────────
    const villainTurn = useCallback((currentHero, currentVillain) => {
        // IA simples: defende se com menos de 30% de vida, caso contrário ataca
        const villainLifePercent = currentVillain.life / currentVillain.maxLife;
        const action = villainLifePercent < 0.3 && Math.random() < 0.5 ? "defense" : "attack";

        setTimeout(() => {
            if (action === "defense") {
                setVillain((v) => ({ ...v, isDefending: true }));
                addLog("🛡️ Vilão se preparou para defender no próximo ataque!");
            } else {
                const rawDamage = calcDamage(currentVillain);
                const { updatedTarget, finalDamage } = applyDamage(currentHero, rawDamage);
                const blocked = currentHero.isDefending ? ` (bloqueou parte: ${rawDamage - finalDamage} reduzido)` : "";
                addLog(`👹 Vilão atacou e causou ${finalDamage} de dano!${blocked}`);
                setHero({ ...updatedTarget });

                if (updatedTarget.life <= 0) {
                    addLog("💀 O Herói foi derrotado! Game Over.");
                    setGameOver("villain_win");
                    return;
                }
            }

            addLog("🔄 Vez do Herói.");
            setIsHeroTurn(true);
        }, 900);
    }, [addLog]);

    // ── Ações do herói ────────────────────────────────────────────────────────
    const handleAction = useCallback((action) => {
        if (!isHeroTurn || gameOver) return;

        setIsHeroTurn(false);

        let updatedHero = { ...hero, isDefending: false };
        let updatedVillain = { ...villain };

        switch (action) {
            case "attack": {
                const rawDamage = calcDamage(updatedHero);
                const { updatedTarget, finalDamage } = applyDamage(updatedVillain, rawDamage);
                updatedVillain = updatedTarget;
                const blocked = villain.isDefending ? ` (vilão defendeu, ${rawDamage - finalDamage} bloqueado)` : "";
                addLog(`⚔️ Herói atacou e causou ${finalDamage} de dano!${blocked}`);

                setHero(updatedHero);
                setVillain(updatedVillain);

                if (updatedVillain.life <= 0) {
                    addLog("🏆 O Vilão foi derrotado! Você venceu!");
                    setGameOver("hero_win");
                    return;
                }
                break;
            }

            case "defense": {
                updatedHero = { ...updatedHero, isDefending: true };
                addLog("🛡️ Herói assumiu postura defensiva! Próximo ataque causará menos dano.");
                setHero(updatedHero);
                break;
            }

            case "usePotion": {
                if (updatedHero.potions <= 0) {
                    addLog("🧪 Sem poções restantes!");
                    setIsHeroTurn(true);
                    return;
                }
                const healAmount = Math.min(POTION_HEAL, updatedHero.maxLife - updatedHero.life);
                updatedHero = {
                    ...updatedHero,
                    life: updatedHero.life + healAmount,
                    potions: updatedHero.potions - 1,
                };
                addLog(`🧪 Herói usou uma poção e recuperou ${healAmount} de vida! (${updatedHero.potions} poções restantes)`);
                setHero(updatedHero);
                break;
            }

            case "flee": {
                const success = Math.random() < FLEE_CHANCE;
                if (success) {
                    addLog("🏃 Herói conseguiu fugir! Batalha encerrada.");
                    setGameOver("fled");
                    return;
                } else {
                    addLog("🏃 Herói tentou fugir, mas falhou! O Vilão aproveitou...");
                    setHero(updatedHero);
                }
                break;
            }

            default:
                setIsHeroTurn(true);
                return;
        }

        addLog("⏳ Vez do Vilão...");
        villainTurn(updatedHero, updatedVillain);
    }, [hero, villain, isHeroTurn, gameOver, addLog, villainTurn]);

    // ── Reiniciar jogo ────────────────────────────────────────────────────────
    const resetGame = useCallback(() => {
        setHero({ ...HERO_INITIAL });
        setVillain({ ...VILLAIN_INITIAL });
        setIsHeroTurn(true);
        setLog(["⚔️ Nova batalha! É a vez do Herói."]);
        setGameOver(null);
    }, []);

    return {
        hero,
        villain,
        isHeroTurn,
        log,
        gameOver,
        handleAction,
        resetGame,
    };
}
