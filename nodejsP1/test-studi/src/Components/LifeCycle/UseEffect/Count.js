// Comme pour le hook useState, une importation de useEffect depuis React est nécessaire.
import React, { useState, useEffect } from 'react';
 
const Count = () => {
  /**
   * Déclaration d'un état local “count” ainsi que son setter et de son initialisation
   */
  const [count, setCount] = useState(0);
    
  /**
   * Déclaration d'un effet avec useEffect() exécuté après chaque affichage.
   */
  useEffect(() => {
    /**
     * Modification du titre de la page via l'API du navigateur (effet de bord), après le Montage ou la Mise à jour du composant dans le DOM.
     */
    document.title = `Vous avez cliqué ${count} fois`;
  });
 
  return (
    <div>
      <p>Vous avez cliqué {count} fois</p>
      {/* Après chaque clic sur le bouton, l'état local “count” mute, déclenchant une mise à jour dans le DOM, puis l'exécution du contenu de la fonction callback de useEffect. */}
      <button onClick={() => setCount(count + 1)}>
      Cliquez ici
      </button>
    </div>
  );
}
 
export default Count;