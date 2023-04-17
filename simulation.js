$(document).ready(function () {

    var viewAs, bloc2kSize, mainMemorySize, cacheMemorySize, memorySequence, memAccessTime, cacheAccessTime, memoryMap
    // Value Sequence Builder
    var sequence = [];
    $("#addValues").click(function () {
        if ($("#input_sequence").val() == "") {
            alert('Main Memory Values cannot be empty!');
        } 
        else {
            viewAs = 'block';
        

            // Get value from textbox
            var stringSequence = $("#input_sequence").val();
            if (stringSequence.trim() != "") {

                // Valid Inputs
                $("#input_sequence").removeClass("is-invalid");
                $("#input_sequence").addClass("is-valid");

                var arraySequence = stringSequence.split(",");
                var noSpace = $.map(arraySequence, $.trim);


                var integerSequence = noSpace.map(function (x) {
                    return parseInt(x, 10);
                });

                // Check per element validity
                
                memoryType = $('input[name=radioUnit]:checked', '#viewformSize').val();
                cacheType = $('input[name=radioUnit2]:checked', '#viewformSize2').val();
                blockSize2 = parseInt($("#input_blocksize").val());
                if (memoryType == 'block' && cacheType =='block') {
                    mainMemorySize = parseInt($("#input_mmsize").val());
                    cacheMemorySize = parseInt($("#input_cmsize").val());
                }
                else if (memoryType == 'block' && cacheType =='word') {
                    mainMemorySize = parseInt($("#input_mmsize").val());
                    cacheMemorySize = parseInt($("#input_cmsize").val()) / blockSize2;
                }
                else if (memoryType == 'word' && cacheType =='block') {
                    mainMemorySize = parseInt($("#input_mmsize").val()) / blockSize2;
                    cacheMemorySize = parseInt($("#input_cmsize").val());
                }
                else {
                    mainMemorySize = parseInt($("#input_mmsize").val()) / blockSize2;
                    cacheMemorySize = parseInt($("#input_cmsize").val()) / blockSize2;
                }


                var elementsAreValid = true;

                if(viewAs == 'block') {
                    for (var i = 0; i < integerSequence.length; i++) {
                        // console.log(isNaN(integerSequence[i]))
                        if (elementsAreValid) {
                            if ((!isNaN(integerSequence[i])) && (integerSequence[i] >= 0)) {
                                elementsAreValid = true;
                            }
                            else {
                                elementsAreValid = false;
                            }
                        }
                    }
                }
                else { // Viewed as address
                    for (var i = 0; i < integerSequence.length; i++) {
                        var decimalValue = parseInt(integerSequence[i].toString(), 2);
                       
                        if (elementsAreValid) {
                            if ((!isNaN(integerSequence[i])) && (decimalValue >= 0)) {
                                elementsAreValid = true;
                            }
                            else {
                                elementsAreValid = false;
                            }
                        }
                    }
                }
                

                if (elementsAreValid) {
                    // Get multiplier
                    var multiplier = parseInt($("#input_mainMemoryMult").val());
                    if (multiplier > 0) {
                        // Remove error messages
                        $("#input_mainMemoryMult").removeClass("is-invalid");

                        // Add to sequence
                        for (var i = 0; i < multiplier; i++) {
                            sequence = sequence.concat(integerSequence);
                        }

                        // Add to table 
                        $("#sequenceBody").empty();
                        for (var i = 0; i < sequence.length; i++) {
                            var row = "<tr> <td>" + i + "</td>" + "<td> " + sequence[i] + "</td> </tr>"
                            $("#sequenceBody").append(row);
                        }
                    }
                    else {
                        $("#input_mainMemoryMult").removeClass("is-valid");
                        $("#input_mainMemoryMult").addClass("is-invalid");
                    }
                }
                else {
                    $("#input_sequence").removeClass("is-valid");
                    $("#input_sequence").addClass("is-invalid");
                }

            }
            else {
                $("#input_sequence").removeClass("is-valid");
                $("#input_sequence").addClass("is-invalid");
            }
        }
    });

    $("#submitInputs").click(function () {
        viewInputAs = 'block';
        memoryType = $('input[name=radioUnit]:checked', '#viewformSize').val();
        cacheType = $('input[name=radioUnit2]:checked', '#viewformSize2').val();
        blockSize2 = parseInt($("#input_blocksize").val()); // input from block size
        mainMemorySize = parseInt($("#input_mmsize").val()); // input from mm size
        cacheMemorySize = parseInt($("#input_cmsize").val()); // input from cache size

        memorySequence = sequence; // sequence
        memAccessTime = parseFloat($("#input_memaccesstime").val()); // input from memory access time
        cacheAccessTime = parseFloat($("#input_cacheaccesstime").val()); // input from cache access time


        // Validation
        let validConfig = (memoryType === 'word' && validDivisible(blockSize2, mainMemorySize) && cacheType === 'word' && validDivisible(blockSize2, cacheMemorySize)) || (memoryType === 'block' && cacheType === 'word' && validDivisible(blockSize2, cacheMemorySize))|| (memoryType === 'word' && validDivisible(blockSize2, mainMemorySize) && cacheType ==="block") || (memoryType ==='block' && cacheType ==="block");

        var validblockSize2 = validConfig && powerOfTwo(blockSize2) && checkPositive(mainMemorySize);
        var validmainMemorySize = validConfig && checkPositive(mainMemorySize);
        var validcacheMemorySize = validConfig && checkPositive(cacheMemorySize);
        var validmemAccessTime = checkPositive(memAccessTime);
        var validcacheAccessTime = checkPositive(cacheAccessTime);
        var validAll = validblockSize2 && validmainMemorySize && validcacheMemorySize && validmemAccessTime && validcacheAccessTime;

        
        if (validblockSize2) {
            $("#input_blocksize").removeClass("is-invalid");
            $("#input_blocksize").addClass("is-valid");
        }
        else {
            $("#input_blocksize").addClass("is-invalid");
            $("#input_blocksize").removeClass("is-valid");
        }

        // Main Memory Size Validation
        if (validmainMemorySize) {
            $("#input_mmsize").removeClass("is-invalid");
            $("#input_mmsize").addClass("is-valid");
        }
        else {
            $("#input_mmsize").addClass("is-invalid");
            $("#input_mmsize").removeClass("is-valid");
        }

        // Cache Memory Size Validation
        if (validcacheMemorySize) {
            $("#input_cmsize").removeClass("is-invalid");
            $("#input_cmsize").addClass("is-valid");
        }
        else {
            $("#input_cmsize").addClass("is-invalid");
            $("#input_cmsize").removeClass("is-valid");
        }

        // Memory Access Time Validation
        if (validmemAccessTime) {
            $("#input_memaccesstime").removeClass("is-invalid");
            $("#input_memaccesstime").addClass("is-valid");
        }
        else {
            $("#input_memaccesstime").addClass("is-invalid");
            $("#input_memaccesstime").removeClass("is-valid");
        }

        // Memory Access Time Validation
        if (validcacheAccessTime) {
            $("#input_cacheaccesstime").removeClass("is-invalid");
            $("#input_cacheaccesstime").addClass("is-valid");
        }
        else {
            $("#input_cacheaccesstime").addClass("is-invalid");
            $("#input_cacheaccesstime").removeClass("is-valid");
        }

        if (validAll) {
            simulation(viewInputAs, memoryType, cacheType, blockSize2, mainMemorySize, cacheMemorySize, memorySequence, memAccessTime, cacheAccessTime)
            submit();
        }
        else {
            alert("Please fix the errors indicated.");
        }

    });


    function checkPositive(value) {
        return value > 0;
    }

    function validDivisible(blockSize, mcSize) {
        return mcSize % blockSize === 0;
    }


    function powerOfTwo(x) {
        return (Math.log(x) / Math.log(2)) % 1 === 0;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    $("#gooutput").click(function () {
        $(".input-card").hide();
        $(".output-card").show();
        $(".simulation-card").hide();
        $(".retry-button").show();
        $(".poutput-button").hide();

        fa_mru = simulate(viewInputAs, memoryType, cacheType, blockSize2, mainMemorySize, cacheMemorySize, memoryMap, memAccessTime, cacheAccessTime);
        printVals(fa_mru)
    });

    async function simulation(viewInputAs, memoryType, cacheType, blockSize, mainMemorySize, cacheMemorySize, memorySequence, memAccessTime, cacheAccessTime) {
        memoryMap = memorySequence
        fa_mru = simulate(viewInputAs, memoryType, cacheType, blockSize, mainMemorySize, cacheMemorySize, memorySequence, memAccessTime, cacheAccessTime);
        snapshots = fa_mru.cacheSnapshot
        cacheSize = snapshots[0].length

        $("#simulationTable").empty()
        $("#inputSimulation").empty()

        for (var x = 0; x < cacheSize; x++) {
            $("#simulationTable").append("<tr> <th scope=\"row\">" + x + "</th><td id=\"block" + x + "\" class=\"text-right\"></td> </tr>");
            $("#block" + x).val('Ø');
        }

        for (var x = 0; x < memoryMap.length; x++) {
            $("#inputSimulation").append("<div class=\"text-center col\" id=\"input" + x + "\">" + memoryMap[x] + "</div>");
        }

        $("#simulation-body").prop('hidden', false);

        for (var y = 0; y < snapshots.length; y++) {
            for (var x = 0; x < cacheSize; x++) {
                var text = $("#block" + x).val();

                if (snapshots[y][x] != null) {
                    $("#block" + x).text(snapshots[y][x]);
                    $("#block" + x).val(snapshots[y][x]);
                }

                if (memoryMap[y] == snapshots[y][x])
                    $("#block" + x).attr('style', 'color:eb88d0');
                else
                    $("#block" + x).attr('style', 'color:white');

                if (snapshots[y][x] == text && memoryMap[y] == text) {
                    hits = parseInt($("#hits").text())
                    hits++
                    $("#block" + x).text("HIT - " + snapshots[y][x]);
                    $("#hits").text(hits)
                }
                else if (snapshots[y][x] != text && memoryMap[y] == snapshots[y][x]) {
                    misses = parseInt($("#misses").text())
                    misses++
                    $("#block" + x).text("MISS - " + snapshots[y][x]);
                    $("#misses").text(misses)
                }
            }
            $("#input" + y).attr('style', 'color:eb88d0');
            await sleep(2000);

        }

        for (var x = 0; x < cacheSize; x++) {
            $("#block" + x).attr('style', 'color:white');
            if (snapshots[memoryMap.length - 1][x] != null)
                $("#block" + x).text(snapshots[memoryMap.length - 1][x]);

        }
    };

    function printVals(fa_mru) {
        snapshots = fa_mru.cacheSnapshot
        cacheSize = snapshots[0].length

        $("#output-body").append('<p class="card-text colortext"><b>Number of Cache Hits:</b> ' + fa_mru.cacheHit + '</p>')
        $("#output-body").append('<p class="card-text colortext"><b>Number of Cache Miss:</b> ' + fa_mru.cacheMiss + '</p>')
        $("#output-body").append('<p class="card-text colortext"><b>Miss Penalty (ns):</b> ' + fa_mru.missPenalty + '</p> <hr>')
        $("#output-body").append('<p class="card-text colortext"><b>Average Memory Access Time (ns):</b> ' + fa_mru.aveAccessTime + '</p>')
        $("#output-body").append('<p class="card-text colortext"><b>Total Memory Access Time (ns):</b> ' + fa_mru.totalAccessTime + '</p>')
        $("#output-body").append('<p class="card-text colortext"><b>Snapshot of Cache Memory:</p>')
        $("#output-body").append("<div class=\"row\"><div class=\"col\"><table class=\"table\" style='width: 40%'><thead class=\"thead-light\"><tr><th scope=\"col\">Block Number</th><th scope=\"col\">Data</th></tr></thead><tbody id='snapshotTable'></tbody></table></div></div>")
        for (var x = 0; x < cacheSize; x++) {
            if (snapshots[memoryMap.length - 1][x] != null) {
                $("#snapshotTable").append(
                  "<tr> <th class=\"text-white text-center\" scope=\"row\">" + x + "\t</th><td class=\"text-white text-center\">" + snapshots[memoryMap.length - 1][x] + "</td> </tr>"
                );
              } else {
                $("#snapshotTable").append(
                  "<tr> <th class=\"text-white text-center\" scope=\"row\">" + x + "\t</th><td class=\"text-white text-center\">E</td> </tr>"
                );
              }
          }
          
        }
});


function convertToBlock(blockSize, mainMemorySize, cacheMemorySize, memorySequence) {
    const w = Math.log2(blockSize);
    const k = Math.log2(cacheMemorySize);

    const tag = mainMemorySize - w - k;
    let convertedMap = [];


    memorySequence.forEach(loc => {
        
        convertedMap.push((parseInt(loc,2) >>> w) % cacheMemorySize)
    });

    return { mainMemorySize, cacheMemorySize, convertedMap };
}


/**
 * Simulates the cache mapping function
 * @param {String} viewInputAs Either as 'address' or as 'block'
 * @param {String} memoryType Either as 'block' or as 'word'
 * @param {String} cacheType Either as 'block' or as 'word'
 * @param {Number} blockSize Integer that represents block size in words
 * @param {Number} mainMemorySize Integer that represents the size of a memory block in bits
 * @param {Number} cacheMemorySize Integer that represents the cache size in words
 * @param {Array} memorySequence Array of integers that represent the blocks or addresses to be mapped
 * @param {Number} memAccessTime Number that represents the time taken to access the main memory. Keep unit the same as cacheAccessTime
 * @param {Number} cacheAccessTime Number that represents the time taken to access the cache memory. Keep unit the same as memAccessTime
 */
function simulate(viewInputAs, memoryType, cacheType, blockSize, mainMemorySize, cacheMemorySize, memorySequence, memAccessTime, cacheAccessTime) {

    let cacheHit = 0,
        cacheMiss = 0,
        missPenalty = cacheAccessTime * 2 + blockSize * memAccessTime,
        aveAccessTime,
        totalAccessTime = 0,
        cacheSnapshot = [],
        mainMemoryBlockMap
        cacheAge = 0;

    if (memoryType === 'word') {
        mainMemorySize = mainMemorySize / blockSize;
        cacheMemorySize = cacheMemorySize / blockSize;
    }
    if (cacheType === 'word') {
        cacheMemorySize = cacheMemorySize / blockSize;
    }

    if (viewInputAs === 'address') {
        convResult = convertToBlock(blockSize, mainMemorySize, cacheMemorySize, memorySequence);
        mainMemoryBlockMap = convResult.convertedMap;
    } else {
        mainMemoryBlockMap = memorySequence;
    }

    let cache = Array(cacheMemorySize).fill(null);
    let mruBlock = -1;

    
    mainMemoryBlockMap.forEach((blockNum, i) => {
        let blockFound = false;

        //Update Cache Age
        cacheAge +=1;

        // Check if block is already in the cache
        for (let j = 0; j < cacheMemorySize; j++) {
            if (cache[j] === memorySequence[i]) {
                cacheHit += 1;
                blockFound = true;

                // Update MRU block
                mruBlock = j;
                break;
            }
        }

        // If block is not in the cache, find a free slot or evict MRU block
        if (!blockFound) {
            cacheMiss += 1;

            // Find a free slot in the cache
            let freeSlot = cache.findIndex((val) => val === null);
            if (freeSlot !== -1) {
                cache[freeSlot] = memorySequence[i];
                mruBlock = freeSlot;
            } else {
                // Evict MRU block and replace with new block
                cache[mruBlock] = memorySequence[i];
                cacheSnapshot.push([...cache]);
                mruBlock = cache.indexOf(memorySequence[i]);
            }
        }

        

        // Update cache snapshot
        cacheSnapshot.push([...cache]);
    });


    aveAccessTime = (cacheHit / (cacheHit + cacheMiss)) * cacheAccessTime +
        (cacheMiss / (cacheHit + cacheMiss)) * missPenalty;

    totalAccessTime = (cacheHit * blockSize * cacheAccessTime) + 
        (cacheMiss * blockSize * (memAccessTime + cacheAccessTime)) +
        (cacheMiss * cacheAccessTime);
    return { cacheHit, cacheMiss, missPenalty, aveAccessTime, totalAccessTime, cacheSnapshot }
}

$(document).ready(function () {
    $("body").fadeIn();
    $(".output-card").hide();
    $(".simulation-card").hide();
    $(".retry-button").hide();
    $(".poutput-button").hide();
  });

  // Form validator
  (function () {
    'use strict';
    window.addEventListener('load', function () {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName('needs-validation');
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener('submit', function (event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          } else {
            event.preventDefault();
            
          }
        }, false);
      });
    }, false);
  })();

  // Input submit
  function submit() {
    // Values from input
    var blocksize = $("#input_blocksize").val();
    var mmsize = $("#input_mmsize").val();
    var cachesize = $("#input_cmsize").val();

    // Hide input card
    $(".input-card").hide();
    $(".output-card").hide();
    $(".simulation-card").show();
    $(".retry-button").show();
    $(".poutput-button").show();

    // For clearing and appending div contents
    $(".output-body").empty();
    $(".output-button").empty();
    $(".output-button").append('<div class="form-group text-center p-3"> <button type="button" class="btn btn-success" onclick="download()">EXPORT FILE</button> </div>');
  }

  // Retry button
  function retry() {
    location.reload()
  }
  // Download text file
  function download() {
    var a = document.body.appendChild(
      document.createElement("a")
    );
    var textToWrite = document.getElementById("output-body").innerText;
    a.download = "fa/mrucache.txt";
    textToWrite = textToWrite.replace(/\n/g, "%0D%0A");
    a.href = "data:text/plain," + textToWrite;
    a.click();
  }