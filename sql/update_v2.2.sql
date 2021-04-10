
ALTER TABLE t_user ADD display_picture_names INT(1) DEFAULT 1;
ALTER TABLE t_user ADD public INT(1) DEFAULT 0;
ALTER TABLE t_user ADD free_download_dir VARCHAR(500) DEFAULT "fullsize";

ALTER TABLE t_product ADD delivery_directory VARCHAR(500) DEFAULT "fullsize";

CREATE TABLE t_conf (
	password_enable INT(1) DEFAULT 1
);

INSERT into t_conf (password_enable) values(1);
