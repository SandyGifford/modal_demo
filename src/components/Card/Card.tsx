import "./Card.style";

import * as React from "react";
import { CardData } from "../../types";
import Utils from "../../utils";

export interface CardProps {
    card: CardData;
    index: number;
    currentIndex: number;
    childClicked(index: number): void;
    nextCard(): void;
    prevCard(): void;
    back?(): void;
}

const Card: React.FunctionComponent<CardProps> = ({ card: { value, children }, index, currentIndex, nextCard, prevCard, back, childClicked}) => {
    const offset = currentIndex - index;

    const after = offset >= 2;
    const prev = offset === 1;
    const current = offset === 0;
    const next = offset === -1;
    const before = offset <= -2;

    return <div className={Utils.className("Card", {
        mods: {
            before,
            next,
            current,
            prev,
            after,
        }
    })}
    onClick={() => {
        if (next) nextCard();
        if (prev) prevCard();
    }}>
        { back ? <div className="Card__back" onClick={back}>↶</div> : null }
        <div className={Utils.className("Card__value", { mods: { current }})}>{value}</div>
        <div className={Utils.className("Card__children", { mods: { current }})}>{
            children.map((child, i) => <button
                className="Card__children__child"
                onClick={() => childClicked(i)}
                key={i}>
                {child.value}
            </button>)
        }</div>
    </div>;
};

Card.displayName = "Card";

export default Card;
