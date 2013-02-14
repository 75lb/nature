var assert = require("assert"),
    ConfigMaster = require("../lib/config-master"),
    Config = require("../lib/config");

var _configMaster;
beforeEach(function(){
    _configMaster = new ConfigMaster();
});

describe("ConfigMaster", function(){
    describe("methods:", function(){
        it("add(name, configInstance) should be chainable, get(configName) should return the added.", function(){
            var config = new Config()
            var output = _configMaster.add( "test", config );
        
            assert.strictEqual(_configMaster.get("test"), config);
            assert.strictEqual(output, _configMaster);
        });
    
        it("add(name, configName) should add a copy of configName", function(){
            var config1 = new Config()
                .group("whatever")
                    .option("one", { default: 1, valid: /[0-9]/, type: "number" });
            var config2 = _configMaster
                .add("config1", config1 )
                .add("config2", "config1")
                .get("config2");

            assert.deepEqual(config1.definition("one"), config2.definition("one"));
        });

        it("add(name, [configNames]) should add a config with merged copies of configNames", function(){
            var config1 = new Config().option("one", { default: 1 });
            var config2 = new Config().option("two", { default: 2 });
            var config3 = _configMaster
                .add("config1", config1)
                .add("config2", config2)
                .add("config3", [ "config1", "config2" ])
                .get("config3");

            assert.deepEqual(config3.definition("one"), config1.definition("one"));
            assert.deepEqual(config3.definition("two"), config2.definition("two"));
            assert.deepEqual(config3.toJSON(), { one: 1, two: 2 });
        });
        
        it("any other invocation of add() should throw");
        
        it("get(configName,  options) should return correct config with `options` hash values set", function(){
            var config = new Config()
                .option("one", { })
                .option("two", { });
            _configMaster.add("config", config);
            
            assert.throws(function(){
                var config2 = _configMaster.get("config", { one: "uno", two: "due", three: "tre" });
            });
            
            var config2 = _configMaster.get("config", { one: "uno", two: "due" });
            assert.deepEqual(config2.toJSON(), { one: "uno", two: "due" });
        });


        it("get(configName, configInstance) should return correct config with `options` hash values set", function(){
            var config = new Config()
                .option("one", { })
                .option("two", { });
            _configMaster.add("config", config);
            
            var config2 = new Config()
                .option("one", { default: -1 })
                .option("two", { default: -2 })
                .option("three", { default: -3 });

            assert.throws(function(){
                _configMaster.get("config", config2);
            });
            
            config.option("three", {});
            _configMaster.get("config", config2);
            
            assert.deepEqual(config.toJSON(), { one: -1, two: -2, three: -3 });
        });
        
        it("get(configName, [valueArray]) should return correct config with array values set", function(){
            var config = new Config()
                .option("one", { type: Number, default: -1 })
                .option("two", { type: Number, default: -2 })
                .option("three", { type: Number, default: -3 });
        
            _configMaster.add("config", config);
        
            var config2 = _configMaster.get("config", [ "--one", "5", "--two", "10", "--three", "20", "clive" ]);
        
            assert.strictEqual(config, config2);
            assert.deepEqual(config2.toJSON(), {
                one: 5,
                two: 10,
                three: 20
            });
        });
    });

    // //  toConfig()
    // config.group("handbrake").toConfig()
    // 
});
