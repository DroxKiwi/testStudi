Il y a des classes "Subject", qui sont écoutées, et des classes "Observer" qui sont celles qui les écoutent.

PHP fournit nativement deux interfaces qui permettent de mettre en place ce design pattern : les interfaces SplSubject et SplObserver.
```php
<?php

interface SplSubject
{
    // Permet, durant l'exécution de notre script, de rajouter un Observer à un objet
    public function attach(SplObserver $observer);

    // Permet, durant l'exécution de notre script, de retirer un Observer d'un objet
    public function detach(SplObserver $observer);

    // La méthode qui va "tenir au courant" les Observer
    public function notify();
}

interface SplObserver
{
    // La méthode à exécuter lorsque l'Observer est notifié
    public function update(SplSubject $subject);
}
?>
```
Prenons une classe Personne, et déclenchons des événements dès que l'ont fait appel à la méthode permettant de mettre à jour son âge.
```php
<?php

class Person implements SplSubject
{
    private $observers;

    private $age;

    public function __construct(int $age)
    {
        $this->observers = new SplObjectStorage();
        $this->age = $age;
    }

    public function attach(SplObserver $observer)
    {
        $this->observers->attach($observer);
    }

    public function detach(SplObserver $observer)
    {
        $this->observers->detach($observer);
    }

    public function notify()
    {
        foreach ($this->observers as $observer) {
            // Lors de la notification des Observer, nous lançons leurs méthodes à exécuter dans cette situation.
            $observer->update($this);
        }
    }

    public function updateAge()
    {
        $this->age++;
        $this->notify();


        return $this;
    }

    public function getAge()
    {
        return $this->age;
    }
}

class SayHappyBirthday implements SplObserver
{
    public function update(SplSubject $person)
    {
        // Code métier à exécuter lorsque la classe est notifiée
        echo sprintf('Joyeux anniversaire ! Vous avez désormais %s ans<br/>', $person->getAge());
    }
}

class UpdateAdvantages implements SplObserver
{
    public function update(SplSubject $person)
    {
        // Code métier à exécuter lorsque la classe est notifiée
        if (18 === $person->getAge()) {
            echo 'Vous êtes désormais majeur, vous avez de nouveaux avantages, et de nouvelles responsabilités ! <br/>';
        }
    }
}

$observerA = new SayHappyBirthday();
$observerB = new UpdateAdvantages();
$subject = new Person(16);
// On rajoute nos observers à notre sujet
$subject->attach($observerA);
$subject->attach($observerB);

$subject->updateAge();
$subject->updateAge();
$subject->updateAge();
?>