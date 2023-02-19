L'utilisation d'un tel design dans ce cas de figure permettrait, qu'importe la situation, de toujours gérer une notification de la même façon.
```php
<?php

abstract class Notification
{
    // Tout type de notification doit implémenter une méthode send()
    protected abstract function send(string $message);

    public function manageNotification($message)
    {
        // Qu'importe le type de notification, on effectuera des actions préalables et on envoie un message
        $this->doStuff();
        $this->send($message);
    }

    public function doStuff()
    {
        // On pourrait logguer des informations
    }
}

class EmailNotification extends Notification
{
    public $recipient;
    public $subject;

    public function __construct()
    {
        $this->recipient = "contact@societe.com";
        $this->subject = 'Etat applicatif';
    }

    // La méthode send dans ce cas envoie un e-mail
    protected function send(string $message)
    {
        echo sprintf('On envoie le mail ayant pour contenu "%s" au contact "%s" avec pour sujet : %s <br/>', $message, $this->recipient, $this->subject);
    }
}

class SlackNotification extends Notification
{
    public $channel;

    public function __construct()
    {
        $this->channel = "#applicationState";
    }

    public function doStuff()
    {
        parent::doStuff();
        // do something else
    }

    // Ici on poste le message sur un canal
    protected function send(string $message)
    {
        echo sprintf('On notifie le canal %s du message : %s  <br/>', $this->channel, $message);
    }
}


class NotificationFactory
{
    // Selon l'état, on décide de renvoyer un type de notification ou un autre
    public static function createNotificationForState(string $applicationState)
    {
        switch ($applicationState) {
            case 'problem':
                return new SlackNotification();
            case 'normal':
            default:
                return new EmailNotification();
        }
    }
}
```

$notification1 = NotificationFactory::createNotificationForState('problem');
// Affichera : On notifie le canal #applicationState du message : La base de données est innaccessible
$notification1->manageNotification('La base de données est innaccessible');

$notification2 = NotificationFactory::createNotificationForState('normal');
// Affichera : On envoie le mail ayant pour contenu "Tout va bien" au contact "contact@societe.com" avec pour sujet : Etat applicatif
$notification2->manageNotification('Tout va bien');

// Qu'importe ce qui a pu être retourné, on effectue le travail de la même façon
?>

```
