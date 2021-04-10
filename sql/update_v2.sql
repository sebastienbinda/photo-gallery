

CREATE TABLE t_new_product (
	id MEDIUMINT NOT NULL AUTO_INCREMENT,
	name VARCHAR(256) NOT NULL DEFAULT 'unknown',
	price VARCHAR(256) NOT NULL DEFAULT 0,
	product_type VARCHAR(256) default 'standard',
	description VARCHAR(256),
	weight INT(7) NOT NULL DEFAULT 0,
	shipping_type VARCHAR(256) NOT NULL DEFAULT 'letter',
	CONSTRAINT pk_id PRIMARY KEY (id)
);

insert into t_new_product (name,price) select name,price from t_product;

CREATE TABLE ta_new_user_product (
	username VARCHAR(256),
	productid MEDIUMINT,
	CONSTRAINT pkup PRIMARY KEY (username,productid)
);

insert into ta_new_user_product (username,productid) select up.username, p.id from t_new_product p, ta_user_product up where up.productname = p.name;

DROP TABLE ta_user_product;
DROP TABLE t_product;

RENAME TABLE t_new_product TO t_product;
RENAME TABLE ta_new_user_product TO ta_user_product;

ALTER TABLE T_USER ADD ALLOW_DOWNLOAD INT(1) DEFAULT 0;
ALTER TABLE T_USER ADD NB_PICTURES_BY_PAGE INT(3) DEFAULT 25;
ALTER TABLE T_USER ADD NB_PRODUCTS_MIN INT(3) DEFAULT 5;
ALTER TABLE T_USER ADD long_description VARCHAR(2000);

alter table ta_user_product add constraint FOREIGN KEY fku (username) REFERENCES t_user(login);
alter table ta_user_product add constraint FOREIGN KEY fkp (productid) REFERENCES t_product(id);

create TABLE t_enum_order_state (
	id INT NOT NULL,
	state VARCHAR(256) NOT NULL,
	CONSTRAINT pk_order_state_id PRIMARY KEY (id)
);

INSERT INTO t_enum_order_state(id,state) VALUES (0,"DELIVERY_WAIT");
INSERT INTO t_enum_order_state(id,state) VALUES (1,"ONLY_DOWNLOAD");
INSERT INTO t_enum_order_state(id,state) VALUES (2,"DELIVERED");

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

