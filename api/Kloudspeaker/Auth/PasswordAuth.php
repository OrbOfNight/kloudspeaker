<?php
namespace Kloudspeaker\Auth;

class PasswordAuth {
    public function __construct($container) {
        $this->container = $container;
        //TODO server hash & no_Dev_urandom
        $config = $container->configuration;
        $this->hash = new \Kloudspeaker\Auth\PasswordHash($config->get('server_hash_salt', 'KLOUDSPEAKER_SERVER_SALT'), $config->get('no_udev_random', FALSE));
    }

    public function authenticate($user, $pw) {
        $auth = $this->container->users->getUserAuth($user["id"]);

        if (!$auth) {
            $this->container->logger->error("User auth info not found");
            throw new \Kloudspeaker\NotAuthenticatedException("Authentication failed");
        }
        return ($this->hash->isEqual($pw, $auth["hash"], $auth["salt"]));
    }

    public function getInfo() {
        return [ "type" => "pw" ];
    }
}