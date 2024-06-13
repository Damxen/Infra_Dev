Pour l'infrastructure de notre projet, nous avons configuré 3 VMs : 

Une VM pfsense (dhcp + firewall)
Une VM Linux ubuntu server. (Serveur)
Une VM Windows 10. (Client)

Nous avons configuré la vm pfsense de cette manière :

# Pfsense 2.6.0 (firewall)
facile a utilisé 
passerelle (routeur)(DHCP, DNS) et Firewall


## Set-Up VM
Ajout d'un network adaptater pour le réseau LAN
WAN -> em0 (dhcp)
LAN -> em1

## Config du WAN et LAN
ip du WAN:                192.168.20.134/24 pour internet
ip du LAN IpV4:           192.168.1.254/24 pour notre réseau
DHCP start:               192.168.1.1 
DHCP end:                 192.168.1.254
gateway:                  192.168.1.253 

## Pfsense Infos
https://192.168.1.254
User:admin
mdp: azerty
HostName: InfraDev
Domain: Infra.dev

--------------------------------

Après avoir configuré le dhcp, la passerelle ainsi que le dhcp sur pfsense, nous avons configuré le serveur web.

# Ubuntu-24.04.2 (serveur WEB) 

## Set-Up VM
Ajout d'un network adaptater pour NAT
La VM host only

## Infos
Nom:                    Damien
Nom machine:            realsrvweb-infra
Pseudo:                 damien
mdp:                    azerty
DHCPv4:                 192.168.72.130/24

-> ip statique : 192.168.1.10

## PhpMyAdmin Infos

mdp:azerty

## Certif Https

letsencrypt certonly --standalone -agree-tos -d Infra.dev --renew-by-default

dhclient -r -v ens37

apt install apache2 
apt install isc-dhcp-client
apt install letsencrypt
apt install mysql-server
apt install phpmyadmin
apt install git -> importation de notre code via notre repo github

apt install python3-pip python3-venv
    python3 -m venv venv
    source venv/bin/activate
        pip install Flask
        pip install Flask-CORS
        pip install Flask-JWT-Extended
        pip install mysql-connector-python
        pip install Werkzeug
        pip install requests

    Deactivate


----------------------------------

Nous avons ensuite configuré notre VM client. (Windows)

## Vm Client (Windows)

Windows 10Client

Nom : Dams
mdp : azerty
ip : dhcp (192.168.20.131)

Nous avons commencé par configuré les ip automatiques :

ipconfig /release
ip config /renew 

Cela permet d'assigner les adresses ip via dhcp.

Nous avons testé les pings. Le DNS est configuré. Lorsque nous effectuons un ping du nom de la vm pfsense, le ping fonctionne.
-> ping InfraDev.Infra.dev

Les pings fonctionnent vers internet ainsi que vers nos VMs. Les ip sont donc bien configurées.

pfsense est donc bien configuré. Pour le vérifier : http://192.168.1.254 dans notre navigateur. Nous arrivons bien sur le dashboard pfsense.

Apache aussi est bien présent, pour le vérifier : http://192.168.1.10 dans notre navigateur. Nous arrivons bel et bien sur la default page d'apache.




