define(["Tone/instrument/FMSynth", "helper/Basic", "helper/InstrumentTests"], function (FMSynth, Basic, InstrumentTest) {

	describe("FMSynth", function(){

		Basic(FMSynth);
		InstrumentTest(FMSynth, "C4");

		context("API", function(){

			it ("can get and set carrier attributes", function(){
				var fmSynth = new FMSynth();
				fmSynth.carrier.oscillator.type = "triangle";
				expect(fmSynth.carrier.oscillator.type).to.equal("triangle");
				fmSynth.dispose();
			});

			it ("can get and set modulator attributes", function(){
				var fmSynth = new FMSynth();
				fmSynth.modulator.envelope.attack = 0.24;
				expect(fmSynth.modulator.envelope.attack).to.equal(0.24);
				fmSynth.dispose();
			});

			it ("can get and set harmonicity", function(){
				var fmSynth = new FMSynth();
				fmSynth.harmonicity.value = 2;
				expect(fmSynth.harmonicity.value).to.equal(2);
				fmSynth.dispose();
			});

			it ("can be constructed with an options object", function(){
				var fmSynth = new FMSynth({
					"carrier" : {
						"filter" : {
							"rolloff" : -24
						}
					}
				});
				expect(fmSynth.carrier.filter.rolloff).to.equal(-24);
				fmSynth.dispose();
			});

			it ("can get/set attributes", function(){
				var fmSynth = new FMSynth();
				fmSynth.set({
					"harmonicity" : 1.5
				});
				expect(fmSynth.get().harmonicity).to.equal(1.5);
				fmSynth.dispose();
			});

		});
	});
});