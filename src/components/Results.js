import React, { useMemo, useEffect, useState, useCallback } from 'react';
import debounce from 'debounce';
import '../styles/Results.css';
import ResultCard from './ResultCard';

export default function Results({ username, services }) {
  // these are cards with loading state enabled. Create once, use many times
  const spinningCards = useMemo(
    () =>
      services.map(({ service: serviceName }) => (
        <ResultCard serviceName={serviceName} key={`${serviceName} spin`} spin />
      )),
    [services],
  );

  // cards to render in this component
  const [cards, setCards] = useState(spinningCards);

  // returns real functional cards
  const createCards = (username, services) =>
    services.map(({ service: serviceName, endpoint }) => {
      const checkEndpoint = endpoint.replace('{username}', username);
      return (
        <ResultCard serviceName={serviceName} checkEndpoint={checkEndpoint} key={serviceName} />
      );
    });

  // sets the cards with a debounce. This allows us not to calculate real cards while user keeps typing
  const debouncedSetCards = useCallback(
    debounce((username, services) => {
      setCards(createCards(username, services));
    }, 800),
    [],
  );

  // use spinning cards until user stops typing (debounce)
  useEffect(() => {
    setCards(spinningCards);
    debouncedSetCards(username, services);
    return () => {
      debouncedSetCards.clear();
    };
    // eslint-disable-next-line
  }, [username, services]);

  // render cards
  return useMemo(() => {
    return <div className="results">{cards}</div>;
  }, [cards]);
}
