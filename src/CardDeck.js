import Card from "./Card";
import "./CardDeck.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuid } from "uuid";

const CardDeck = () => {
  const INITIAL_STATE_SHUFFLE = {
    text: "Shuffle the Deck!",
    disabled: false,
  };
  const [cards, setCards] = useState([]);
  const [cardDeck, setCardDeck] = useState(null);
  const [shuffleState, setShuffleState] = useState(INITIAL_STATE_SHUFFLE);

  useEffect(() => {
    async function getDeck() {
      const url = "https://deckofcardsapi.com/api/deck/new/";
      const res = await axios.get(url);
      setCardDeck({ deckId: res.data.deck_id });
    }
    getDeck();
  }, []);

  async function drawCard() {
    const url = `https://deckofcardsapi.com/api/deck/${cardDeck.deckId}/draw/?count=1`;
    const res = await axios.get(url);
    if (res.data.success === true) {
      setCards((prevCards) => [
        ...prevCards,
        { src: res.data.cards[0].image, id: uuid() },
      ]);
    } else if (res.data.success === false && res.data.remaining === 0) {
      alert("“Error: no cards remaining!”");
    }
  }

  async function shuffleDeck() {
    //disable shuffle button while shuffling
    setShuffleState({
      text: "Shuffling...",
      disabled: true,
    });

    try {
      setCards([]);
      const url = `https://deckofcardsapi.com/api/deck/${cardDeck.deckId}/shuffle/`;
      await axios.get(url);
    } catch (error) {
      alert(error);
    } finally {
      setShuffleState(INITIAL_STATE_SHUFFLE);
    }
  }

  const cardComponents = cards.map(({ src, id }) => (
    <Card key={id} imgSrc={src}></Card>
  ));

  return (
    <div>
      <button className="Button-Draw" onClick={drawCard}>
        Draw a Card!
      </button>
      <button
        className="Button-Shuffle"
        onClick={shuffleDeck}
        disabled={shuffleState.disabled}
      >
        {shuffleState.text}
      </button>
      <div>{cardComponents}</div>
    </div>
  );
};

export default CardDeck;
