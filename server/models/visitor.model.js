'use strict';

module.exports = (sequelize, DataTypes) => {
	var Model = sequelize.define('Visitor', {
		uuid        : {type: DataTypes.UUID, primaryKey: true},
		ip_address  : {type: DataTypes.TEXT},
		referrer_url: {type: DataTypes.TEXT}
	}, {
		timestamps: true,
		updatedAt : false
	});

	Model.associate = function(models) {
		this.Url = this.belongsTo(models.Url);
	};

	Model.prototype.toWeb = function (pw) {
		let json = this.toJSON();
		return json;
	};

	return Model;
};
