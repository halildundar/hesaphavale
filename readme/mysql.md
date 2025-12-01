CREATE DATABASE IF NOT EXISTS `tuvnord` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE tuvnord
CREATE TABLE IF NOT EXISTS `users`(
`id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
`name` VARCHAR(50) NOT NULL,
`email` VARCHAR(100) NOT NULL,
`password` VARCHAR(255) NOT NULL
`role` VARCHAR(255) //sys-admin,admin,user
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `genel-bilgiler`(
`id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
`name` VARCHAR(50) NOT NULL,
`kayit_tarih` VARCHAR(50) NOT NULL,
`dogum_yil` VARCHAR(50) NOT NULL,
`email` VARCHAR(100) NOT NULL,
`tel` VARCHAR(255) NOT NULL,
`adres` VARCHAR(255),
`sirket` VARCHAR(255),
`user_id` INT(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `tecrubeler`(
`id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
`yil` VARCHAR(50) NOT NULL,
`proje` VARCHAR(255) NOT NULL,
`detay_kod` VARCHAR(255) NOT NULL,
`user_id` INT(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `sertifikalar`(
`id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
`yil` VARCHAR(50) NOT NULL,
`kapsam` VARCHAR(255) NOT NULL,
`unvan` VARCHAR(255) NOT NULL,
`user_id` INT(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `is-deneyim`(
`id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
`yil` VARCHAR(50) NOT NULL,
`yer` VARCHAR(255) NOT NULL,
`kurum` VARCHAR(255) NOT NULL,
`pozisyon` VARCHAR(255) NOT NULL,
`gorevler` VARCHAR(255) NOT NULL,
`user_id` INT(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `projeler`(
`id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
`yil` VARCHAR(50) NOT NULL,
`kurum` VARCHAR(255) NOT NULL,
`unvan` VARCHAR(255) NOT NULL,
`user_id` INT(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `egitimler`(
`id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
`yil` VARCHAR(50) NOT NULL,
`kurum` VARCHAR(255) NOT NULL,
`unvan` VARCHAR(255) NOT NULL,
`user_id` INT(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `kurslar`(
`id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
`yil` VARCHAR(50) NOT NULL,
`kurs` VARCHAR(255) NOT NULL,
`unvan` VARCHAR(255) NOT NULL,
`user_id` INT(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `users` VALUES (0,'Halil Dündar','halildundar.eee@gmail.com','153ud153');

column ekleme
ALTER TABLE table_name
ADD COLUMN column_name VARCHAR(15) AFTER colum_name;

select a.*,b.*,c.*,d.*,e.*  
from [DatabaseName].[Table_a] a 
INNER JOIN [DatabaseName].[Table_b] b ON a.id = b.id 
INNER JOIN [DatabaseName].[Table_c] c ON b.id=c.id 
INNER JOIN [DatabaseName].[Table_d] d on c.id=d.id 
INNER JOIN [DatabaseName].[Table_e] e on d.id=e.id where a.con=5  and 
b.con=6

SELECT * from `planlama`  WHERE str_to_date(LASTUPDATE, '%d.%m.%Y') > '01.01.2021';//lastupdate--> column name
SELECT * from `planlama` WHERE LASTUPDATE between '2016-12-29 17:24:22' AND '2016-12-31 23:59:59';

SELECT * from `planlama` WHERE str_to_date(denetim_tarih,'%d.%m.%Y') between str_to_date('02.01.2025','%d.%m.%Y') AND str_to_date('05.03.2025','%d.%m.%Y')

nodemailer için gmail şifresi elde etme
MAIL_PASSWORD='eomk unmg cvfz wxal' (orjianl şifre 'Bet123456*')
https://security.google.com/settings/security/apppasswords

START TRANSACTION;
SELECT @A:=SUM(salary) FROM table1 WHERE type=1;
UPDATE table2 SET summary=@A WHERE type=1;
COMMIT;