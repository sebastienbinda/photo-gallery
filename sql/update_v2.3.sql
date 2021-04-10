
ALTER TABLE t_user ADD display_search_view INT(1) DEFAULT 0;
ALTER TABLE t_user ADD search_infos_description VARCHAR(1000);
ALTER TABLE t_user ADD search_placeholder VARCHAR(250);
ALTER TABLE t_user ADD default_search_tags VARCHAR(500);

ALTER TABLE t_user ADD indexed INT(1) DEFAULT 0;

CREATE TABLE t_picture (
	id MEDIUMINT NOT NULL AUTO_INCREMENT,
	user_login VARCHAR(256) NOT NULL,
	name VARCHAR(256) NOT NULL,
	section VARCHAR(256),
	thumb_width VARCHAR(256),
	thumb_height VARCHAR(256),
	keyword VARCHAR(500),
	CONSTRAINT pk_id PRIMARY KEY (id)
);