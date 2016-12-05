describe('env', function (){
  describe('chai', function (){
    describe('should', function (){
      it('默认应该有should属性', function (){
        var o = {};
        o.should.be.an('object');
      });
    });
  });

  describe('sinon', function (){
    it('sinon应该可用', function (){
      should.exist(sinon);
    });
  });

  describe('supertest', function (){
    it('request应该可用', function (){
      should.exist(request);
    });
  });
})
