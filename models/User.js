const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// create the USER model
class User extends Model{
// set up method to run on instance data (per user) to check password
checkPassword(loginPw){
    return bcrypt.compareSync(loginPw, this.password);
}
}


//define table columns and configuration
User.init(
    {
        //TABLE COLUMN DEFINITIONS 

        //define an id column
        id: {
            // use the special Sequelize Dataypes object provide what type of data it is
            type: DataTypes.INTEGER, 
            // equivalent to SQL NOT NULL Option
            allowNull: false, 
            //primary Key instructin
            primaryKey: true, 
            //auto-increment
            autoIncrement: true
        }, 
        // define username column
        username: {
            type: DataTypes.STRING, 
            allowNull: false
        },
        //define email colum
            email: {
                type: DataTypes.STRING, 
                allowNull: false, 
                //there cant be duplicate emails in the table
                unique: true,
                // if allowNull is false, run data through validators before creating tables
                validate: {
                    isEmail: true
                }
        },
        //define a passwod column
        password: {
            type: DataTypes.STRING, 
            allowNull: false, 
            validate: {
                // password must be atleast 4 chars long
                len: [4]
            }
        }
    },
    {
    
        hooks:
        {
    // set up beforeCreate lifecycle 'hook' functionality

            async beforeCreate(newUserData)
                {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
                
            //previous version on hashing password without async property
            // beforeCreate(userData){
            // return bcrypt.hash(userData.password, 10).then(newUserData => {
            // return newUserData
            // });
                },

            // set up beforeCreate lifecycle 'hook' functionality
            async beforeUpdate(updatedUserData)
            {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
            
          // TABLE CONFIGURATION OPTIONS HERE

        // pass in our imported squelize connection (direct connection to the datbase)
        sequelize,
        // don't auto create createdAt/ updatedAt timestamp fields
        timestamps: false, 
        // don't pluralize name of database
        freezeTableName: true,
        //use underscores instead of camel case
        underscored: true, 
        //model name stays lowercase in the database
        modelName: 'user'
    }
);

module.exports = User;