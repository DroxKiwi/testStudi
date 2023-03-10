Une classe finale est une classe qui ne peut pas avoir de classe fille. Essayer d'étendre une classe finale provoquera une erreur fatale de PHP.

Implémentons cela en utilisant l'héritage grâce à une classe abstraite Product permettant de définir la logique de base, 
et deux classes filles EUProduct et USProduct permettant de faire le formatage.
```php
<?php

abstract class Product
{
    private string $name;
    private float $price;

    public function __construct(string $name, float $price)
    {
        $this->name = $name;
        $this->price = $price;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function getPrice(): float
    {
        return $this->price;
    }

    public function setPrice(float $price): void
    {
        $this->price = $price;
    }

    public abstract function formatPrice(): string;
}

class EUProduct extends Product
{
    public function formatPrice(): string
    {
        return $this->getPrice().' €';
    }
}

class USProduct extends Product
{
    public function formatPrice(): string
    {
        return '$'.$this->getPrice();
    }
}

$hardDrive = new EUProduct('Disque dur', 140.00);
$UShardDrive = new USProduct('Hard Drive', 140.00);

echo $hardDrive->formatPrice(); // Affiche 140.00 €
echo '<br>';
echo $UShardDrive->formatPrice(); // Affiche $140.00
?>
```
Le problème principal vient du fait que nous avons intégré à la classe Product une logique qui ne la concernait pas directement : le formatage du prix.

Pour résoudre ce problème, nous pouvons traiter l'affichage dans d'autres classes spécialisées que nous allons passer à nos produits. 
Créons une interface PriceFormatter et ses classes filles dérivées :
```php
<?php

interface PriceFormatter
{
    // Tous nos PriceFormatter devront implémenter cette méthode. Cela nous permet de l'utiliser dans nos produits.
    public function format(float $price): string;
}

// On remarque l'utilisation de classes finales
final class EUFormatter implements PriceFormatter
{
    public function format(float $price): string
    {
        return $price.' €';
    }
}

final class USFormatter implements PriceFormatter
{
    public function format(float $price): string
    {
        return '$'.$price;
    }
}
?>
```
À partir de là, il nous suffit maintenant de composer nos produits avec le bon PriceFormatter. 
Créons donc une propriété de type PriceFormatter, qui sera injectée dans le constructeur :
```php
<?php

require_once 'PriceFormatter.php';

class Product
{
    private string $name;
    private float $price;
    // On déclare une propriété de type PriceFormatter
    private PriceFormatter $formatter;

    public function __construct(string $name, float $price, PriceFormatter $formatter)
    {
        $this->name = $name;
        $this->price = $price;
        // On injecte notre PriceFormatter
        $this->formatter = $formatter;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function getPrice(): float
    {
        return $this->price;
    }

    public function setPrice(float $price): void
    {
        $this->price = $price;
    }

    public function formatPrice(): string
    {
        // Nous faisons appel a notre PriceFormatter pour formatter notre prix. Ce n'est plus utile de créer des classes filles.
        return $this->formatter->format($this->getPrice());
    }
}

$hardDrive = new Product('Disque dur', 140.00, new EUFormatter());
$UShardDrive = new Product('Hard Drive', 140.00, new USFormatter());

echo $hardDrive->formatPrice();
echo '<br>';
echo $UShardDrive->formatPrice();
?>
```
Nous pouvons maintenant créer nos types de produits sous forme de sous-classes sans problème.


Une bonne pratique de développement est de toujours rendre finales les classes qui implémentent une interface. 
Ainsi, la structure des classes d'un projet doit être, dans la plupart des cas : 

    interface > classes abstraites (facultatives) > classes filles finales. 

Cela permet d'éviter d'avoir trop de sous-classes et de rendre le code trop complexe.

De plus, si l'héritage possède l'avantage de centraliser du code, il peut être dangereux de faire dépendre trop de classes d'une même base. 
Cela signifie que, si la base est modifiée, 
lors il faudra tester l'intégralité de nos classes filles pour s'assurer qu'il n'y a pas d’effets indésirables.

La composition permet d'éviter ce problème en séparant notre code en petites "briques" que l'on assemble au besoin, 
mais que l'on pourra tester séparément.