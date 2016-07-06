CREATE TABLE progs
(
devid varchar(14),
progname varchar(30),
senrel varchar(20),
hr int,
min int,
val int
);

CREATE TABLE IF NOT EXISTS `progs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `devid` varchar(14) DEFAULT NULL,
  `progname` varchar(30) DEFAULT NULL,
  `senrel` varchar(20) DEFAULT NULL,
  `day` int(11) NOT NULL,
  `hr` int(11) DEFAULT NULL,
  `min` int(11) DEFAULT NULL,
  `val` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=145 ;

CREATE TABLE IF NOT EXISTS `progs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `devid` varchar(14) DEFAULT NULL,
  `progname` varchar(30) DEFAULT NULL,
  `senrel` varchar(20) DEFAULT NULL,
  `day` int(11) NOT NULL,
  `hr` int(11) DEFAULT NULL,
  `min` int(11) DEFAULT NULL,
  `val` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `devid` (`devid`),
  KEY `progname` (`progname`),
  KEY `senrel` (`senrel`),
  KEY `day` (`day`),
  KEY `hr` (`hr`),
  KEY `min` (`min`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=145 ;