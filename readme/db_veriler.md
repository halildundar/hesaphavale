CREATE DATABASE IF NOT EXISTS `custom` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE tuvnord
CREATE TABLE IF NOT EXISTS `users`(
`id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
`name` VARCHAR(50) NOT NULL,
`email` VARCHAR(100) NOT NULL,
`password` VARCHAR(255) NOT NULL
`role` VARCHAR(255) //sys-admin,admin,user
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `kategori`(
`id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
`name` VARCHAR(50) NOT NULL,
`url` VARCHAR(100) NOT NULL,
`parents` VARCHAR(255) NOT NULL
`acik_kapali` VARCHAR(255) //sys-admin,admin,user
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `urun`(
`id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
`name` VARCHAR(255) NOT NULL,
`url` VARCHAR(255) NOT NULL,
`parents` LONGTEXT  NULL,
`kod` VARCHAR(255)  NULL,
`barkod` VARCHAR(255)  NULL,
`kategori` VARCHAR(255) NULL,
`indirim` VARCHAR(50) NULL,
`fiyat` VARCHAR(100) NULL,
`resimler` LONGTEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `slayt`(
`id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
`name` VARCHAR(255) NOT NULL,
`img_url` LONGTEXT NOT NULL,
`url` LONGTEXT  NULL,
`sira` LONGTEXT  NULL,
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE siparisler
ADD CONSTRAINT fk_siparisler_musteriler
FOREIGN KEY (musteri_id) REFERENCES musteriler(id)
ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS `siparis`(
`id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
`paymentId` VARCHAR(255),
`locale` VARCHAR(255),
`conversationId` VARCHAR(255),
`price` LONGTEXT  NULL,
`paidPrice` LONGTEXT  NULL,
`installment`: VARCHAR(255),
`basketId`: VARCHAR(255),
`callbackUrl` VARCHAR(255),
`paymentCard` LONGTEXT  NULL,
`buyer` LONGTEXT  NULL,
`shippingAddress` LONGTEXT  NULL,
`billingAddress` LONGTEXT  NULL,
`basketItems` LONGTEXT  NULL,
FOREIGN KEY (paymentId) REFERENCES silarisler(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `eticsites`(
`id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
`sira` INT(11),
`site_name` VARCHAR(255) ,
`site_logo` VARCHAR(500) ,
`site_url` VARCHAR(5000) ,
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `firmalar`(
`id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
`kisa_ad` VARCHAR(255) NOT NULL,
`unvan` VARCHAR(255) NOT NULL,
`ilce` VARCHAR(255),
`il` VARCHAR(255),
`adres` VARCHAR(255),
`kayit_tarih` VARCHAR(50) NOT NULL,
`genel_mudur` VARCHAR(50) NOT NULL,
`son_kontrolcu` VARCHAR(100) NOT NULL,
`tel` VARCHAR(255) NOT NULL,
`emil` VARCHAR(255),
`posta_kod` VARCHAR(255),
`vergi_no` VARCHAR(255),
`user_id` INT(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `sertifikalar`(
`id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
`cins` VARCHAR(255) NOT NULL,
`marka` VARCHAR(255) NOT NULL,
`cert_no` VARCHAR(255),
`cert_start_date` VARCHAR(255),
`cert_end_date` VARCHAR(255),
`cert_filepath` VARCHAR(100) NOT NULL,
`tip` VARCHAR(255) NOT NULL,
`stroke` VARCHAR(50) NOT NULL,
`kapasite` VARCHAR(50) NOT NULL,
`hiz` VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `durak-kapi-kilit`(
`id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
`cins` VARCHAR(255) NOT NULL,
`marka` VARCHAR(255) NOT NULL,
`cert_no` VARCHAR(255),
`cert_start_date` VARCHAR(255),
`cert_end_date` VARCHAR(255),
`cert_filepath` VARCHAR(100) NOT NULL,
`tip` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `tampon`(
`id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
`onay_kurum_id` INT(11) NOT NULL,
`cert_no` VARCHAR(255),
`cert_start_date` VARCHAR(255),
`cert_end_date` VARCHAR(255),
`marka` VARCHAR(255),
`tip` VARCHAR(255),
`hiz` VARCHAR(255),
`kapasite` VARCHAR(255),
`cert_filepath` VARCHAR(100) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `onay-kurumlar`(
`id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
`name` VARCHAR(255) NOT NULL,
`unvan` VARCHAR(255) NOT NULL,
`adres` VARCHAR(255),
`nobo` VARCHAR(255),
`nobo_link` VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `ucm-acop`(
`id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
`onay_kurum_id` VARCHAR(255) NOT NULL,
`cert_no` VARCHAR(255) NULL,
`cert_start_date` VARCHAR(255)  NULL,
`cert_end_date` VARCHAR(255)  NULL,
`cert_filepath` VARCHAR(100) NULL,
`marka` VARCHAR(255) NULL,
`tip` VARCHAR(255) NULL,
`cert_filepath` VARCHAR(255) NULL,
`stroke` VARCHAR(255) NULL,
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `proje-firma`(
`id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
`unvan` VARCHAR(255) NOT NULL,
`adres` VARCHAR(255) NULL,
`elk_muh_adi` VARCHAR(255)  NULL,
`elk_smm_no` VARCHAR(255)  NULL,
`elk_oda_no` VARCHAR(100) NULL,
`mak_muh_adi` VARCHAR(255) NULL,
`mak_smm_no` VARCHAR(255) NULL,
`mak_oda_no` VARCHAR(255) NULL,
`smm_filepath` VARCHAR(255) NULL,
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `personel`(
`id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
`name` VARCHAR(255) NOT NULL,
`email` VARCHAR(255) NULL,
`telefon` VARCHAR(255)  NULL,
`gorev` VARCHAR(255)  NULL,
`unvan` VARCHAR(255)  NULL,
`sifre` VARCHAR(100) NULL,
`status` VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `as_firma`(
`id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
`kisa_ad` VARCHAR(255) NOT NULL,
`unvan` VARCHAR(255) NULL,
`adres` VARCHAR(255)  NULL,
`email` VARCHAR(255)  NULL,
`telefon` VARCHAR(255)  NULL,
`sirket_muduru` VARCHAR(255) NULL,
`son_kontrolcu` VARCHAR(255) NULL,
`status` TINYINT(1) 0,
`firma_konum` VARCHAR(255) NULL,
`imza_kase` VARCHAR(255) NULL,
`logo` VARCHAR(255) NULL,
`vergi_levhasi` VARCHAR(255) NULL,
`imza_sirkuleri` VARCHAR(255) NULL,
`faalyet_belgesi` VARCHAR(255) NULL,
`sicil_gazetesi` VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `planlama`(
`id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
`as_firma_id` INT(11) NOT NULL,
`modul` VARCHAR(255) NULL,
`denetci` VARCHAR(255)  NULL,
`as_seri_no` VARCHAR(255)  NULL,
`il_id`  INT(11) NOT NULL,
`ilce_id`  INT(11) NOT NULL,
`mahalle_id` INT(11) NOT NULL,
`adres` VARCHAR(255) NULL,
`ada` VARCHAR(255) NULL,
`parsel` VARCHAR(255) NULL,
`yapi_ruhsati` VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `denetim`(
`id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
`planlama_id` INT(11) NOT NULL,
`sinif` VARCHAR(255) NULL,
`elek_hidrolik` VARCHAR(255) NULL,
`aski_tipi` VARCHAR(255) NULL,
`direkt_endirekt` VARCHAR(255) NULL,
`beyan_yuk` VARCHAR(255) NULL,
`beyan_hiz` VARCHAR(255) NULL,
`kisi_sayisi` VARCHAR(255) NULL,
`as_seyir_mesafesi` VARCHAR(255) NULL,

`kapi_on_adet` VARCHAR(255) NULL,
`kapi_ar_adet` VARCHAR(255) NULL,
`kapi_sol_adet` VARCHAR(255) NULL,
`kapi_sag_adet` VARCHAR(255) NULL,

`durak_sayisi` VARCHAR(255) NULL,
`kabin_ag` VARCHAR(255) NULL,
`karsi_ag_ag` VARCHAR(255) NULL,
`motor_kw` VARCHAR(255) NULL,
`makine_oran` VARCHAR(255) NULL,
`kabin_ray_tip` VARCHAR(255) NULL,
`karsi_ray_tip` VARCHAR(255) NULL,
`halat_mm` VARCHAR(255) NULL,
`halat_adet` VARCHAR(255) NULL,
`hiz_reg_id` VARCHAR(255) NULL,
`hiz_reg_serino` VARCHAR(255) NULL,
`durak_kapi_kilit_id` VARCHAR(255) NULL,
`durak_kapi_kilit_serino` VARCHAR(255) NULL,
`kabin_kapi_kilit_id` VARCHAR(255) NULL,
`kabin_kapi_kilit_serino` VARCHAR(255) NULL,
`fren_id` VARCHAR(255) NULL,
`fren_serino` VARCHAR(255) NULL,
`ucm_acop_id` VARCHAR(255) NULL,
`ucm_acop_serino` VARCHAR(255) NULL,
`kart_id` VARCHAR(255) NULL,
`kart_serino` VARCHAR(255) NULL,
`kab_tamp_id` VARCHAR(255) NULL,
`kab_tamp_serino` VARCHAR(255) NULL,
`kar_tamp_id` VARCHAR(255) NULL,
`kar_tamp_serino` VARCHAR(255) NULL,

`makd_kapi_yukseklik` VARCHAR(255) NULL,
`makd_kapi_genislik` VARCHAR(255) NULL,
`makd_yukseklik` VARCHAR(255) NULL,
`makd_hareket_yukseklik` VARCHAR(255) NULL,
`kabin_genislik` VARCHAR(255) NULL,
`kabin_derinlik` VARCHAR(255) NULL,
`kabin_yukselik` VARCHAR(255) NULL,
`kuyu_genislik` VARCHAR(255) NULL,
`kuyu_derinlik` VARCHAR(255) NULL,
`kuyu_dip_yukseklik` VARCHAR(255) NULL,
`kuyu_son_kat_yukseklik` VARCHAR(255) NULL,
`kapi_genislik` VARCHAR(255) NULL,
`kapi_yukseklik` VARCHAR(255) NULL,

`regg_konum` VARCHAR(255) NULL,
`kab_rayarasi` VARCHAR(255) NULL,
`kar_rayarasi` VARCHAR(255) NULL,
`kab_kar_rayarasi` VARCHAR(255) NULL,
`ray_kapi` VARCHAR(255) NULL,
`dura_kapi_` VARCHAR(255) NULL,
`folder_path` VARCHAR(255) NULL,
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `danis_firma`(
`id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
`kisa_ad` VARCHAR(255) NOT NULL,
`unvan` VARCHAR(255) NULL,
`adres` VARCHAR(255)  NULL,
`email` VARCHAR(255)  NULL,
`telefon` VARCHAR(255)  NULL,
`sirket_muduru` VARCHAR(255) NULL,
`vergi_levhasi` VARCHAR(255) NULL,
`imza_sirkuleri` VARCHAR(255) NULL,
`faalyet_belgesi` VARCHAR(255) NULL,
`sicil_gazetesi` VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `danis_basvuru`(
`id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
`danisman_id` INT(11) NOT NULL,
`firma_id` INT(11) NOT NULL,
`modul` VARCHAR(255) NULL,
`yapi_ruhsat_no` VARCHAR(255)  NULL,
`as_seri_no` VARCHAR(255)  NULL,
`yapi_sahibi_adi` VARCHAR(255)  NULL,
`il_id` INT(11) NULL,
`ilce_id` INT(11) NULL,
`mahalle_id` INT(11) NULL,
`adres` VARCHAR(255) NULL,
`ada` VARCHAR(255) NULL,
`parsel` VARCHAR(255) NULL,
`durak_sayisi` VARCHAR(255) NULL,
`seyir_mesafesi` VARCHAR(255) NULL,
`beyan_yuku` VARCHAR(255) NULL,
`kisi_saiyisi` VARCHAR(255) NULL,
`yapi_ruhsati` VARCHAR(255) NULL,
`ab_uygunluk_beyani` VARCHAR(255) NULL,
`risk` VARCHAR(255) NULL,
`teknik_dosya` VARCHAR(255) NULL,
`status` VARCHAR(255) NULL,
`aciklama` VARCHAR(255) NULL,
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




