CREATE TABLE t_conf (
	password_enable INT(1) DEFAULT 1
);

INSERT into t_conf (password_enable) values(1);

CREATE TABLE t_user (
	public INT(1) DEFAULT 0,
	login VARCHAR(256),
	password VARCHAR(256),
	description VARCHAR(256),
	allow_download INT(1) DEFAULT 0,
	nb_pictures_by_page INT(3) DEFAULT 25,
	nb_products_min INT(3) DEFAULT 5,
	long_description VARCHAR(2000),
	section_display_mode INT(1) DEFAULT 0,
	section_info_description VARCHAR(2000),
	display_picture_names INT(1) DEFAULT 1,
	free_download_dir VARCHAR(500) DEFAULT "fullsize",
	CONSTRAINT pk_login PRIMARY KEY (login)
);

CREATE TABLE t_product (
	id MEDIUMINT NOT NULL AUTO_INCREMENT,
	name VARCHAR(256) NOT NULL DEFAULT 'unknown',
	price VARCHAR(256) NOT NULL DEFAULT 0,
	product_type VARCHAR(256) default 'standard',
	description VARCHAR(256),
	weight INT(7) NOT NULL DEFAULT 0,
	shipping_type VARCHAR(256) NOT NULL DEFAULT '0-letter',
	delivery_directory VARCHAR(500) DEFAULT 'fullsize',
	CONSTRAINT pk_id PRIMARY KEY (id)
);

CREATE TABLE ta_user_product (
	username VARCHAR(256),
	productid MEDIUMINT,
	CONSTRAINT fku FOREIGN KEY (username) 
	REFERENCES t_user(login),
	CONSTRAINT fkp FOREIGN KEY (productid) 
	REFERENCES t_product(id),
	CONSTRAINT pkup PRIMARY KEY (username,productid)
);

create TABLE t_enum_order_state (
	id INT NOT NULL,
	state VARCHAR(256) NOT NULL,
	CONSTRAINT pk_order_state_id PRIMARY KEY (id)
);

create TABLE t_order (
	id MEDIUMINT NOT NULL AUTO_INCREMENT,
	username VARCHAR(256) NOT NULL,
	useremail VARCHAR(256) NOT NULL,
	date DATETIME NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	status INT NOT NULL,
	downloadfile VARCHAR(256),
	CONSTRAINT fk_order_user FOREIGN KEY (username)
	REFERENCES t_user(login),
	CONSTRAINT fk_order_state FOREIGN KEY (status)
	REFERENCES t_enum_order_state(id),
	CONSTRAINT pk_order_id PRIMARY KEY (id)
);

INSERT INTO t_user (login,password,description) VALUES ("admin","admin","Administrateur");

INSERT INTO t_enum_order_state(id,state) VALUES (0,"DELIVERY_WAIT");
INSERT INTO t_enum_order_state(id,state) VALUES (1,"ONLY_DOWNLOAD");
INSERT INTO t_enum_order_state(id,state) VALUES (2,"DELIVERED");

