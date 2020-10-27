import "./App.style";

import * as React from "react";
import * as faker from "faker";
import Card from "../Card/Card";
import {CardData} from "../../types";
import Utils from "../../utils";

export interface AppProps {}

type Tiers<T> = [T, T, T, T, T, T];

const tierMax: Tiers<number> = [10, 1, 20, 5, 1, 15];
const tierGenerator: Tiers<() => string> = [
    () => faker.name.firstName() + " " + faker.name.lastName(),
    faker.phone.phoneNumber,
    faker.vehicle.manufacturer,
    faker.vehicle.model,
    faker.company.companyName,
    faker.address.country,
];

function mapTier(index: number): CardData[] {
    if (!tierMax[index]) return [];

    const max = tierMax[index];
    const generator = tierGenerator[index];

    const tiers: CardData[] = [];

    for (let i = 0; i < faker.random.number({ min: 1, max }); i++) tiers.push({
        value: generator(),
        children: mapTier(index + 1),
    });

    return tiers;
}

const tree: CardData[] = mapTier(0);

const App: React.FunctionComponent<AppProps> = () => {
    const [indexes, setIndexes] = React.useState<number[]>([0]);
    let lastCards = tree;

    function next(): void {
        const tierIndex = indexes.length - 1;
        const newIndexes = [...indexes];
        if (newIndexes[tierIndex] + 1 >= breadcrumbs[tierIndex].length) return;
        newIndexes[tierIndex] = newIndexes[tierIndex] + 1;
        setIndexes(newIndexes);
    }

    function prev(): void {
        const tierIndex = indexes.length - 1;
        const newIndexes = [...indexes];
        if (newIndexes[tierIndex] - 1 < 0) return;
        newIndexes[tierIndex] = newIndexes[tierIndex] - 1;
        setIndexes(newIndexes);
    }

    function keyHandler(e: KeyboardEvent): void {
        switch (e.key) {
            case "ArrowLeft":
                prev();
                break;
            case "ArrowRight":
                next();
                break;
        }
    }

    React.useEffect(() => {
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });

    console.log(indexes);

    const breadcrumbs = indexes.map(i => {
        const ret = lastCards;
        lastCards = lastCards[i].children;
        return ret;
    });

    const currentIndex = indexes[indexes.length - 1];
    const currentTier = breadcrumbs[breadcrumbs.length - 1];

    return <div className="App">
        <div className="App__breadcrumbs">{
            breadcrumbs.map((cards, i) => {
                const isLast = i === breadcrumbs.length - 1;
                const hasMultiple = breadcrumbs[i].length > 1;
                return <React.Fragment key={i}>
                    <div
                        className={Utils.className("App__breadcrumbs__crumb", { mods: { isLast, hasMultiple } })}
                        onClick={() => {
                            setIndexes(indexes.slice(0, i + 1));
                        }}>
                        {cards[indexes[i]].value}
                    </div>
                    {!isLast ? <div className="App__breadcrumbs__separator" /> : null}
                </React.Fragment>
            })
        }</div>
        {
            currentTier.map((card, i) => <Card
                key={JSON.stringify([breadcrumbs.length, i])}
                index={i}
                childClicked={childIndex => setIndexes([...indexes, childIndex])}
                prevCard={prev}
                nextCard={next}
                back={breadcrumbs.length > 1 ? () => {
                    if (indexes.length > 1) {
                        const newIndexes = [...indexes];
                        newIndexes.pop();
                        setIndexes(newIndexes)
                    }
                } : null}
                currentIndex={currentIndex}
                card={card} />)
        }
    </div>;
};

App.displayName = "App";

export default App;
