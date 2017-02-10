mysql -u root forecast

alter table locations add id INTEGER AUTO_INCREMENT PRIMARY KEY;
ALTER TABLE `locations` ADD `address` VARCHAR(100) NOT NULL , ADD INDEX (`address`) ;
ALTER TABLE `locations` ADD `lat` DECIMAL(10,8) NOT NULL , ADD INDEX (`lat`) ;
ALTER TABLE `locations` ADD `lng` DECIMAL(11,8) NOT NULL , ADD INDEX (`lng`) ;
ALTER TABLE `locations` ADD `doma` VARCHAR(8) NULL DEFAULT NULL AFTER `id`, ADD INDEX (`doma`) ;
ALTER TABLE `locations` ADD `veri` BOOLEAN NOT NULL , ADD INDEX (`veri`) ;


ALTER TABLE `locations` CHANGE `address` `address` VARCHAR(100) NULL DEFAULT NULL;
alter table locations CHANGE COLUMN `id` `id` INTEGER FIRST; #make id the first column
ALTER TABLE locations CHANGE COLUMN `location` `raw` VARCHAR(60);
ALTER TABLE locations AUTO_INCREMENT = 10000;
UPDATE locations SET id = id+10000;
UPDATE locations SET address = NULL;
UPDATE locations (address, lat, lng) values("mabibiaddress", -42.333, 15.666) WHERE id = 10167;
ALTER TABLE `locations` ADD INDEX(`st`);

SELECT * FROM `locations` WHERE `raw` LIKE '%Parley Vale%'





node-mysql

var post ={location: '12 Parley Vale, Jamaica Plain, MA 02130'}
connection.query('INSERT INTO `locations` SET ?', post, function(err, result) {
  if (err) throw err;
  console.log(result)
  done();
});

